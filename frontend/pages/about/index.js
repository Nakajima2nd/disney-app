import styled from 'styled-components'
import { Box } from '@material-ui/core'
import Head from 'next/head'

const Container = styled(Box)`
  padding: 10px 5px;
  background-color: white;
`

const SubContainer = styled(Box)`
  padding-bottom: 20px;
`

const SectionHead = styled(Box)`
  background-color: #E1F8FF;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 5px;
`

const Doc = styled(Box)`
  padding: 5px;
  font-size: 1.1rem;
`

const About = () => {
  return (
    <>
      <Head>
        <title>このWebサイトについて|ディズニープラン</title>
        <meta property="og:title" content="このWebサイトについて|ディズニープラン" />
        <meta property="og:description" content="ディズニーランド・シーを効率よくめぐる計画をたてるwebアプリです！リアルタイム待ち時間を考慮しています！" />
        <meta property="og:image" content="/og.png" />
      </Head>
      <Container>
        <SubContainer>
          <SectionHead>
            このWebサイトについて
          </SectionHead>
          <Doc>
            こんにちは！<br/>
            アクセスありがとうございます。このWebサイトを管理しているDオタの旦那と申します。<br/>
            ディズニー好きの奥さんの影響でディズニーにはまり、「こんなツールがあったらいいな」と思ったツールを開発して公開しています。
          </Doc>
          <Doc>
            <b>当サイトは個人が運営するディズニーファンサイトです。</b><br/>
            米国ディズニー・エンタプライズ・インク、株式会社オリエンタルランドなどのディズニー関連会社とは関係ありません。
          </Doc>
        </SubContainer>
        <SubContainer>
          <SectionHead>免責事項</SectionHead>
          <Doc>
            当Webサイトからのリンクやバナーなどで移動したサイトで提供される情報、サービスについて一切の責任を負いません。<br/>
            また、当Webサイトのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。<br/>
            当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
          </Doc>
        </SubContainer>
        <SubContainer>
          <SectionHead>お問い合わせ</SectionHead>
          <Doc>
          当Webサイトについてのお問い合わせは下記のアドレスまでお願いいたします。（(at)を@に変えてください。）<br/>
          for.develop.0424(at)gmail.com<br/>
          なお、お問い合わせいただいても必ずご返信することを保障するものではないことをあらかじめご了承ください。<br/>
          </Doc>
        </SubContainer>
      </Container>
    </>
  )
}

export default About