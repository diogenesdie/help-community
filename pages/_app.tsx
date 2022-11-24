import '@/styles/globals.css'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import '@/styles/theme.css'
import type { AppProps } from 'next/app'
import Head from 'next/head';
import { useRef } from 'react';
import { version } from "../package.json";
import { SWRConfig } from 'swr';
import ProvideAuthenticate from '@/hooks/authenticate-hook'

const swrConfig = {
	revalidateOnFocus: false
};

const HelpCommunityApp = ({ Component, pageProps }: AppProps) => {
	console.log(`HelpCommunityApp version ${version}`);
	
	return (
		<SWRConfig value={swrConfig}>
			<ProvideAuthenticate>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Help Community</title>
			</Head>
			<Component {...pageProps} />
			</ProvideAuthenticate>
		</SWRConfig>
	);
}

export default HelpCommunityApp;