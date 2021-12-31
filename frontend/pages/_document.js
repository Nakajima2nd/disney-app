import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet as StyledComponentSheets } from 'styled-components';
import { ServerStyleSheets as MaterialUiServerStyleSheets } from '@material-ui/styles';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='ja'>
        <Head>
          <style>{'#__next { height: 100%}'}
          </style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

MyDocument.getInitialProps = async (ctx) => {
  const styledComponentSheets = new StyledComponentSheets();
  const materialUiServerStyleSheets = new MaterialUiServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          styledComponentSheets.collectStyles(materialUiServerStyleSheets.collect(<App {...props} />)),
      });

    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {styledComponentSheets.getStyleElement()}
          {materialUiServerStyleSheets.getStyleElement()}
        </>
      ),
    };
  } finally {
    styledComponentSheets.seal();
  }
};
