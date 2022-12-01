import { ISession, IUser } from "@/types/authenticate";
import { city, report, district, report_feedback, category } from "@prisma/client";
import { getSequence } from "@/config/prisma";
import prisma from "@/config/prisma";
import { validateFilters, validateReportPayload } from "@/data/report/validation";
import { IListRecords, IListRecordsPayload } from "@/types/api";
import { IResponseError } from "@/types/response";
import { getDescDataPassada } from "@/utils/string-utils";
import Filter from 'bad-words';

export interface IReportMediaPayload {
    base64: string;
}

export interface IReportPayload {
    body: string;
    medias: IReportMediaPayload[];
    city: city['indexed_name'];
    district: district['indexed_name'];
    category: category['indexed_name'];
}

export interface IReportReturnPayload extends IReportPayload {
    report_id: number;
    user: IUser;
    time: string;
    votes?: number;
    city: city['name'];
    district: district['name'];
    category: category['indexed_name'];
}

export interface IFiltersReports extends IListRecordsPayload {
    search: string;
    status: 'A';
    page: number;
    limit: number;
    sortField: 'created_at' | 'updated_at' | 'votes';
    sortOrder: 'asc' | 'desc'
    city: city['indexed_name'];
    district: district['indexed_name'];
    category: category['indexed_name'];
}

const hasBadWords = (text: string): boolean => {
    const filter = new Filter();

    filter.addWords("lazarento",
	"arrombado",
	"foda",
	"foda-se",
	"vai se foder",
	"vai a merda",
	"arrombada",
	"fudeo",
	"fudeu",
	"gozar",
	"gozada",
	"merda",
	"bosta",
	"punheta",
	"filho da puta",
	"filha da puta",
	"punhetinha",
	"punheteiro",
	"fdp",
	"cuzão",
	"cusão",
	"cusão",
	"viado",
	"viadinho",
	"xota",
	"putaria",
	"putero",
	"puto",
	"puteiro",
	"bilau",
	"vadiazinha",
	"putinha",
	"babaca",
	"retardado",
	"cusinho",
	"cuzinho",
	"filho de um corno",
	"rapariga",
	"rabão",
	"vadia",
	"puta",
	"arrombada",
	"caralho",
	"broxa",
	"imbecil",
	"imbessil",
	"bastarda",
	"bastardo",
	"buceta",
	"bucetuda",
	"vsf",
	"vai se foder",
	"boceta",
	"cu",
	"rola",
	"rolas",
	"biscate",
	"pau no cu",
	"pau no seu cu",
	"pica",
	"pika",
	"piroca",
	"piroka",
	"coco",
	"cocozão",
	"pirok",
	"caraio",
	"vai tomar no cu",
	"vagabunda",
	"vagaba",
	"porra",
	"corno",
	"bixa",
	"bicha",
	"baitola",
	"boquete",
	"bronha",
	"brioco",
	"caga",
	"enrabada",
	"enrabado",
	"cagar",
	"cagado",
	"cagada",
	"arregaçada",
	"arregaçado",
	"bixinha",
	"bichinha",
	"bichona",
	"bixona",
	"arregassado",
	"arregassada",
	"chota",
	"chupada",
	"chupeta",
	"xupeta",
	"grelo",
	"grelinho",
	"greluda",
	"otario",
	"otaria",
	"prega",
	"rabuda",
	"raxada",
	"siririca",
	"tesuda",
	"tezuda",
	"xavasca",
	"chavasca",
	"xibiu",
	"xoxota",
	"chochota")

    return filter.isProfane(text);
}


const verifySpam = async (session: ISession): Promise<boolean> => {
    // need wait 10 minutes to send another report
    const reportsCount = await prisma.report.count({
        where: {
            user_id: session.user?.id,
            created_at: {
                gte: new Date(new Date().getTime() - 10 * 60 * 1000)
            }
        }
    });

    if (reportsCount >= 1) {
        return true;
    }

    return false;
}

export const getReports = async (session: ISession, filters: IFiltersReports): Promise<IListRecords<IReportReturnPayload>> => {
    const normalizedFilters = validateFilters(filters);
    const where: any = {
        body: {
            contains: normalizedFilters.search,
            mode: 'insensitive'
        }
    };

    if( normalizedFilters.city ){
        const city = await prisma.city.findFirst({
            where: {
                indexed_name: normalizedFilters.city
            },
            select: {
                city_id: true
            }
        });

        if( city ) {
            where.city_id = {
                equals: city.city_id
            }
        }
    } 

    if( normalizedFilters.district ){
        const district = await prisma.district.findFirst({
            where: {
                indexed_name: normalizedFilters.district
            },
            select: {
                district_id: true
            }
        });

        if( district ) {
            where.district_id = {
                equals: district.district_id
            }
        }
    }

    if( normalizedFilters.category ){
        const category = await prisma.category.findFirst({
            where: {
                indexed_name: normalizedFilters.category
            },
            select: {
                category_id: true
            }
        });

        if( category ) {
            where.category_id = {
                equals: category.category_id
            }
        }
    }

    const reports = await prisma.report.findMany({
        where: where,
        orderBy: {
            [normalizedFilters.sortField]: normalizedFilters.sortOrder,
        },
        skip: (normalizedFilters.page - 1) * normalizedFilters.limit,
        take: normalizedFilters.limit,
        include: {
            report_media: true,
            user: true,
            city: true,
            district: true,
            category: true
        }
    });

    const formatedData = reports.map(report => ({
        report_id: report.report_id,
        body: report.body,
        medias: report.report_media.map(media => ({
            base64: media.base64
        })),
        votes: report.votes,
        user: {
            id: report.user?.user_id,
            username: report.user?.username
        },
        time: getDescDataPassada(report.created_at),
        city: report.city?.name,
        district: report.district?.name,
        category: report.category?.indexed_name
    } as IReportReturnPayload));

    const totalData = await prisma.report.count({
        where: where
    });

    return {
        data: formatedData,
        page: normalizedFilters.page!,
        totalData: totalData,
        totalPages: Math.ceil(totalData / normalizedFilters.limit!),
    } as IListRecords<IReportReturnPayload>;
}

export const insertReport = async (session: ISession, payload: IReportPayload) => {
    const verifySpamResult = await verifySpam(session);

    if (verifySpamResult) {
        throw {
            name: 'NOT_ALLOWED',
            message: 'You need wait 10 minutes to send another report'
        } as IResponseError;
    }

    const formatedPayload = validateReportPayload(payload);

    if( hasBadWords(formatedPayload.body) ){
        throw {
            name: 'NOT_ALLOWED',
            message: 'Your report contains bad words'
        } as IResponseError;
    }

    const report_id = await getSequence('help_community.seq_report');

    const city = await prisma.city.findFirst({
        where: {
            indexed_name: formatedPayload.city
        },
        select: {
            city_id: true
        }
    });

    if (!city) {
        throw {
            name: 'NOT_FOUND',
            message: 'City not found'
        } as IResponseError;
    }

    const district = await prisma.district.findFirst({
        where: {
            indexed_name: formatedPayload.district,
            city_id: city.city_id
        },
        select: {
            district_id: true
        }
    });

    if (!district) {
        throw {
            name: 'NOT_FOUND',
            message: 'District not found'
        } as IResponseError;
    }

    const category = await prisma.category.findFirst({
        where: {
            indexed_name: formatedPayload.category
        },
        select: {
            category_id: true
        }
    });

    if (!category) {
        throw {
            name: 'NOT_FOUND',
            message: 'Category not found'
        } as IResponseError;
    }

    const report = await prisma.report.create({
        data: {
            report_id: report_id,
            user_id: session.user?.id,
            title: formatedPayload.body.substring(0, 50),
            body: formatedPayload.body,
            city_id: city.city_id,
            district_id: district.district_id,
            category_id: category.category_id,
            created_at: new Date(),
            updated_at: new Date(),
            report_media: {
                create: await Promise.all(formatedPayload.medias.map(async (media) => {
                    return {
                        report_media_id: await getSequence('help_community.seq_report_media'),
                        base64: media.base64,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                }))
            }
        }
    });

    return report;
}

const voteReport = async (session: ISession, report_id: number, type: report_feedback['type']): Promise<report['votes']> => {
    if( !session.user || !session.user.id ) {
        throw {
            name: 'NOT_FOUND',
            message: 'User not found',
        } as IResponseError;
    }

    const report = await prisma.report.findUnique({
        where: {
            report_id: report_id
        }
    });

    if (!report) {
        throw {
            name: 'NOT_FOUND',
            message: 'Report not found',
        } as IResponseError;
    }

    const report_feedback = await prisma.report_feedback.findFirst({
        where: {
            report_id: report_id,
            user_id: session.user?.id
        }
    });

    if (report_feedback) {
        await prisma.report_feedback.delete({
            where: {
                report_feedback_id: report_feedback.report_feedback_id
            }
        });

    }

    await prisma.report_feedback.create({
        data: {
            report_feedback_id: await getSequence('help_community.seq_report_feedback'),
            report_id: report_id,
            user_id: session.user?.id!,
            type: type,
            created_at: new Date()
        }
    });

    const reportSearch = await prisma.report.findUnique({
        where: {
            report_id: report_id
        },
        select: {
            votes: true
        }
    });

    return reportSearch?.votes || 0;
}

export const voteReportUp = async (session: ISession, report_id: number): Promise<report['votes']> => {
    return voteReport(session, report_id, 'UP');
}

export const voteReportDown = async (session: ISession, report_id: number): Promise<report['votes']> => {
    return voteReport(session, report_id, 'DOWN');
}