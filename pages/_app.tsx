import React,{Fragment} from 'react'
import App from 'next/app'

// 解决使用cssModule link跳转失效问题 https://github.com/zeit/next.js#router-events
const css = require('../src/style/empty.scss')

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <Fragment>
        123
        <Component {...pageProps} />
      </Fragment>
    )
  }
}

export default MyApp