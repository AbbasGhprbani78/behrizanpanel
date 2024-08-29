'use client'
import React from 'react'
import styles from '../../styles/Report.module.css'
import SideBar from '../../components/module/SideBar/SideBar'
import Header from '../../components/module/Header/Header'
import { Bar, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart } from 'recharts'
import DoughnutChart from '../../components/module/PieChart/PieChart'


import { Line } from 'recharts'
import { LuExternalLink } from "react-icons/lu";
export default function Report() {
  const data1 = [
    {
      "name": "Page A",
      "uv": 4000,
      "pv": 2400,
      "amt": 2400
    },
    {
      "name": "Page B",
      "uv": 3000,
      "pv": 1398,
      "amt": 2210
    },
    {
      "name": "Page C",
      "uv": 2000,
      "pv": 9800,
      "amt": 2290
    },
    {
      "name": "Page D",
      "uv": 2780,
      "pv": 3908,
      "amt": 2000
    },
    {
      "name": "Page E",
      "uv": 1890,
      "pv": 4800,
      "amt": 2181
    },
    {
      "name": "Page F",
      "uv": 2390,
      "pv": 3800,
      "amt": 2500
    },
    {
      "name": "Page G",
      "uv": 3490,
      "pv": 4300,
      "amt": 2100
    }
  ]
  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <div className={styles.wrapperpage}>
      <SideBar />
      <div className={styles.pagecontent}>
        <Header title="گزارشات" />
        <div className={styles.maincontent}>
          <div >
            <p className={styles.textchart}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, eveniet.</p>
            <div className={styles.Box1}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart width={150} height={40} data={data}>
                  <Bar dataKey="uv" fill="#ffcb05" />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ marginTop: "50px" }}>
            <p className={styles.textchart}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro, facilis!</p>
            <div className={styles.Box2}>
              <div className={styles.TableBox}>
                <div className={styles.Title}>
                  <a href=''>
                    View Details
                    <LuExternalLink />
                  </a>
                  <span className={styles.textbox2}>This Month Pie Chart</span>
                </div>
                <div className={styles.Table}>
                  <table className="table text-center table-responsive" dir='ltr'>
                    <thead className={styles.thead}>
                      <tr>
                        <th scope="col" colSpan="3" >Label</th>
                        <th scope="col" >value</th>
                        <th scope="col" >%</th>
                      </tr>
                    </thead>
                    <tbody className={styles.Tbody}>
                      <tr>
                        <th scope="row" colSpan="3">
                          <div className={styles.ThBox}>
                            <div className={styles.Color1}></div>
                            <span >Label 1</span>
                          </div>
                        </th>
                        <td>Mark</td>
                        <td>Otto</td>
                      </tr>
                      <tr>
                        <th scope="row" colSpan="3">
                          <div className={styles.ThBox}>
                            <div className={styles.Color2}></div>
                            <span >Label 2</span>
                          </div>
                        </th>
                        <td>Mark</td>
                        <td>Otto</td>
                      </tr>
                      <tr>
                        <th scope="row" colSpan="3">
                          <div className={styles.ThBox}>
                            <div className={styles.Color3}></div>
                            <span>Label 3</span>
                          </div>
                        </th>
                        <td>Mark</td>
                        <td>Otto</td>
                      </tr>
                      <tr>
                        <th scope="row" colSpan="3">
                          <div className={styles.ThBox}>
                            <div className={styles.Color4}></div>
                            <span >Label 4</span>
                          </div>
                        </th>
                        <td>Mark</td>
                        <td>Otto</td>
                      </tr>
                      <tr>
                        <th scope="row" colSpan="3">
                          <div className={styles.ThBox}>
                            <div className={styles.Color5}></div>
                            <span>Label 5</span>
                          </div>
                        </th>
                        <td>Mark</td>
                        <td>Otto</td>
                      </tr>
                      <tr>
                        <th scope="row" colSpan="3">
                          <div className={styles.ThBox}>
                            <div className={styles.Color6}></div>
                            <span>Label 6</span>
                          </div>
                        </th>
                        <td>Mark</td>
                        <td>Otto</td>
                      </tr>
                      {/* سطرهای دیگر */}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className={styles.Chart2}>
                <DoughnutChart />
              </div>
            </div>
          </div>
          <div style={{ marginTop: "50px" }}>
            <p className={styles.textchart}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore, cum.</p>
            <div className={styles.Box3}>
              <ResponsiveContainer>
                <LineChart
                  data={
                    data1
                  }
                  margin={{ top: 5, right: 30, left: -30, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis orientation="left" />
                  <Tooltip />
                  <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                  <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
