
import { run } from './generator';

export default function (context: any, options: any) {
    return {
        name: 'docusaurus-plugin-generate-structured-data',
        extendCli(cli: any) {
            cli
                .command('generate-structured-data')
                .description('Generated JSON-LD structured data for SEO')
                .action(() => {
                    run(context, options);
                });
        },
    };
}