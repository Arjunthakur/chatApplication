import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div>
      <Head>
        <title>chat Apllication</title>
        <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
      </Head>

      <Sidebar />
    </div>
  )
}
