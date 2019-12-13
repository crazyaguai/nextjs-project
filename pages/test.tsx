import React,{Component} from 'react'
const css = require('../src/style/test.scss')
import Link from 'next/link'

class TestPage extends Component{
  // 只能在pages的文件中使用，获取初始加载数据
  static async getInitialProps(page){
    return {
      a: 'test1'
    }
  }
  render(){
    return (
      <div className={css.example}>
        {/* {this.props.a} */}
        <Link href="/home">
          <a>go home page</a>
        </Link>
      </div>
    )
  }
}

export default TestPage