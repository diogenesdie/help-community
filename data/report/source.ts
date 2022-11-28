import { ISession, IUser } from "@/types/authenticate";
import { report } from "@prisma/client";
import { getSequence } from "@/config/prisma";
import prisma from "@/config/prisma";
import { validateFilters, validateReportPayload } from "@/data/report/validation";
import { IListRecords, IListRecordsPayload } from "@/types/api";

export interface IReportMediaPayload {
    base64: string;
}

export interface IReportPayload {
    body: string;
    medias: IReportMediaPayload[];
}

export interface IReportReturnPayload extends IReportPayload {
    user: IUser;
    votes?: number;
}

export interface IFiltersReports extends IListRecordsPayload {
    search: string;
    status: 'A';
    page: number;
    limit: number;
    sortField: 'created_at' | 'updated_at' | 'votes';
    sortOrder: 'asc' | 'desc'
}

export const getReports = async (session: ISession, filters: IFiltersReports): Promise<IListRecords<IReportReturnPayload>> => {
    const normalizedFilters = validateFilters(filters);
    const where = {
        OR: [
            {
                body: {
                    contains: normalizedFilters.search
                }
            }
        ]
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
            user: true
        }
    });

    const formatedData = reports.map(report => ({
        body: report.body,
        medias: report.report_media.map(media => ({
            base64: media.base64
        })),
        votes: report.votes,
        user: {
            id: report.user?.user_id,
            username: report.user?.username
        }
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
    const formatedPayload = validateReportPayload(payload);
    const report_id = await getSequence('help_community.seq_report');

    const report = await prisma.report.create({
        data: {
            report_id: report_id,
            user_id: session.user?.id,
            title: formatedPayload.body.substring(0, 50),
            body: formatedPayload.body,
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