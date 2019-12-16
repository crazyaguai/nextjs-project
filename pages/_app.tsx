import React,{Fragment} from 'react'
import App from 'next/app'
// import '../node_modules/antd/dist/antd.min.css'
import Head from 'next/head'

// 解决使用cssModule link跳转失效问题 https://github.com/zeit/next.js#router-events
const css = require('../src/style/empty.scss')

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <Fragment>
        <Head>
          <title>title</title>
          <link rel="stylesheet" type="text/css" href="/css/antd.min.css" />
        </Head>
        <Component {...pageProps} />
      </Fragment>
    )
  }
}

export default MyApp