import React from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import Link from 'next/link'
import Router from 'next/router'
import {Button} from 'antd'

const Home = () => (
  <div>
    <Head>
      <title>Home</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    {/* <Nav /> */}
    <div>
      <Link href="/test">
        <a>go test page</a>
      </Link>
      <Button onClick={()=>{Router.push('/test')}}>go test page</Button>
    </div>
  </div>
)

export default Home
