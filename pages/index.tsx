
import AppWrapper from "@/components/shared/AppWrapper";
import { useState } from "react";
import Feed from "@/components/shared/Feed";

const PageFeed = (): JSX.Element => {
    return (
        <AppWrapper
            currentMenu="HOME"
        >
			<Feed />
        </AppWrapper>
    );
};

export default PageFeed;