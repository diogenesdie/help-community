
import AppWrapper from "@/components/shared/AppWrapper";
import Feed from "@/components/shared/Feed";
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; 

const PageFeed = (): JSX.Element => {
    return (
        <AppWrapper
            currentMenu="HOME"
        >
			<Feed />
        </AppWrapper>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'pt', ['common','menu','feed','categorys']))
    }
});

export default PageFeed;