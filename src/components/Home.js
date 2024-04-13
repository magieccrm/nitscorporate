import { Tooltip } from "bootstrap";
import React, { useState } from "react";
import randomcolor from 'randomcolor';
import { Link } from "react-router-dom";
import LineChart from "./LineChart";
import LineChart1 from "./LineChart1";
import { getAllAgent, getAllAgentWithData } from "../features/agentSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from 'react-apexcharts';
import { getAllLeadSource } from "../features/leadSource";
import axios from "axios";
import MyCalendar from "../components/Pages/MonthlyCalendar"
import Notification from "./Notification";

function Home() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const DBuUrl = process.env.REACT_APP_DB_URL;
  const [Sale, setSale] = useState([]);
  const [leadsource, setleadsource] = useState([]);
  const [leadsourcedata1, setleadsourcedata] = useState([]);
  var { agent } = useSelector((state) => state.agent);
  const { leadSourcedata } = useSelector((state) => state.leadSource);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData1 = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        // dispatch(getAllAgent());
        dispatch(getAllLeadSource())
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData1();

    if (localStorage.getItem("role") === "admin") {
      getSale()
      getAllLeadSourceOverview()
      dispatch(getAllAgent());
      getHigstNoOfCall();
      getLeadCountData();
      AgentWishLeadCount1({ role: localStorage.getItem("user_id"), user_id: localStorage.getItem("user_id") })
    }
    if (localStorage.getItem("role") === "TeamLeader") {
      YearlySaleApiForTeamLeader()
      LeadSourceOverviewApiForTeamLeader()
      DashboardLeadCountOfUserByTeamLeader();
      dispatch(getAllAgentWithData({ assign_to_agent: localStorage.getItem("user_id") }));
      GetUserCallAccordingToTeamLeader(localStorage.getItem("user_id"))
      AgentWishLeadCount1({ role: localStorage.getItem("user_id"), user_id: localStorage.getItem("user_id") })
    }
    if (localStorage.getItem("role") === "user") {
      YearlySaleApiForUser()
      LeadSourceOverviewApiForUser()
      DashboardLeadCountOfUser();
      dispatch(getAllAgent({ assign_to_agent: localStorage.getItem("user_id") }));
      getHigstNoOfCall();
      AgentWishLeadCount1({ role: localStorage.getItem("user_id"), user_id: localStorage.getItem("user_id") })
    }





  }, []);


  const [Detail, setDetail] = useState([]);
  const [LeadCount, setLeadCount] = useState([]);


  const AgentWishLeadCount1 = async () => {
    try {
      const responce = await axios.post(
        `${apiUrl}/AgentWishLeadCount1`,
        { role: localStorage.getItem("role"), user_id: localStorage.getItem("user_id") },
        {
          headers: {
            "Content-Type": "application/json",
            "mongodb-url": DBuUrl,
          }
        }
      );
      setLeadCount(responce?.data?.Count);
    } catch (error) {

      console.log(error);
      setLeadCount(error.responce?.data?.Count);
    }
  }

  const getHigstNoOfCall = async () => {
    try {
      const responce = await axios.get(
        `${apiUrl}/GetAllUserCallLogById/`, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
        }
      }
      );
      setDetail(responce?.data?.array);
    } catch (error) {

      console.log(error);
      setDetail(error.responce?.data?.array);
    }
  }
  const GetUserCallAccordingToTeamLeader = async (assign_to_agent) => {
    try {
      const responce = await axios.post(
        `${apiUrl}/GetUserCallAccordingToTeamLeader`, {
        assign_to_agent,
      }, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
        }
      }
      );
      setDetail(responce?.data?.array);
    } catch (error) {

      console.log(error);
      setDetail(error.responce?.data?.array);
    }
  }


  const getSale = async () => {
    try {
      const responce = await axios.get(
        `${apiUrl}/YearlySaleApi`, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
        },
      }
      );
      setSale(responce?.data?.details);

    } catch (error) {

      console.log(error);
    }
  };

  const YearlySaleApiForTeamLeader = async () => {
    try {
      const responce = await axios.post(
        `${apiUrl}/YearlySaleApiForTeamLeader`, {
        user_id: localStorage.getItem("user_id"),
      }, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
        }
      }
      );
      setSale(responce?.data?.details);
    } catch (error) {

      console.log(error);

    }
  }
  const YearlySaleApiForUser = async () => {
    try {
      const responce = await axios.post(
        `${apiUrl}/YearlySaleApiForUser`, {
        user_id: localStorage.getItem("user_id"),
      }, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
        }
      }
      );
      setSale(responce?.data?.details);
    } catch (error) {

      console.log(error);

    }
  }

  const getAllLeadSourceOverview = async () => {
    try {
      const responce = await axios.get(
        `${apiUrl}/lead_source_overview_api`,
        {
          headers: {
            "Content-Type": "application/json",
            "mongodb-url": DBuUrl,
          },
        }
      );
      setleadsourcedata(responce?.data?.Lead_source_count);
      setleadsource(responce?.data?.Lead_source_name);

    } catch (error) {
      console.log(error);
    }
  }
  const LeadSourceOverviewApiForTeamLeader = async () => {
    try {
      const responce = await axios.post(
        `${apiUrl}/LeadSourceOverviewApiForTeamLeader`, {
        user_id: localStorage.getItem("user_id"),
      }, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
        }
      }
      );
      setleadsourcedata(responce?.data?.Lead_source_count);
      setleadsource(responce?.data?.Lead_source_name);
    } catch (error) {

      console.log(error);

    }
  }
  const LeadSourceOverviewApiForUser = async () => {
    try {
      const responce = await axios.post(
        `${apiUrl}/LeadSourceOverviewApiForUser`, {
        user_id: localStorage.getItem("user_id"),
      }, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
        }
      }
      );
      setleadsourcedata(responce?.data?.Lead_source_count);
      setleadsource(responce?.data?.Lead_source_name);
    } catch (error) {

      console.log(error);

    }
  }


  const [leadcountdata, setleadcountdata] = useState({});
  const getLeadCountData = async () => {
    try {
      const responce = await axios.get(
        `${apiUrl}/DashboardLeadCount`, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
        },
      }
      );
      setleadcountdata(responce?.data?.Count);
    } catch (error) {
      const message = await error?.response?.data?.message;
      if (message == 'Client must be connected before running operations' || message == 'Internal Server Error') {
        // getLeadCountData();
      }
      console.log(error);
    }
  }
  const DashboardLeadCountOfUser = async () => {
    try {
      const responce = await axios.post(
        `${apiUrl}/DashboardLeadCountOfUser`, {
        user_id: localStorage.getItem("user_id"),
      }, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
        }
      }
      );
      setleadcountdata(responce?.data?.Count);
    } catch (error) {

      console.log(error);
      setleadcountdata(error.responce?.data?.Count);
    }
  }
  const DashboardLeadCountOfUserByTeamLeader = async () => {
    try {
      const responce = await axios.post(
        `${apiUrl}/DashboardLeadCountOfUserByTeamLeader`, {
        user_id: localStorage.getItem("user_id"),
      }, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
        }
      }
      );
      setleadcountdata(responce?.data?.Count);
    } catch (error) {

      console.log(error);
      setleadcountdata(error.responce?.data?.Count);
    }
  }



  // const getAllUnassignLead=async()=>{
  //   try {
  //     const responce = await axios.get(
  //       `${apiUrl}/getAllUnassignLead`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "mongodb-url": DBuUrl,
  //       },
  //     }
  //     );
  //     setleadcountdata(responce?.data?.lead);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }


  const colors = randomcolor({ count: leadsourcedata1.length });
  const options = {
    labels: leadsource,
    colors: colors,
  };
  return (
    <div>
      {/* <Notification /> */}
      <div className="content-wrapper">
        <section className="content py-5">
          <div className="container ">
            <div className="row d-none">
              <div className="col-12 col-lg-6 col-md-6 col-xl-6 pl-0 ">
                <div className="cardbox02">
                  <div className="panel-body new_leads bd-panel">
                    <h2>New Lead</h2>
                    <p>16</p>
                  </div>
                  <div className="lead_img  align-items-center">
                    <img src="dist/img/Capture_Leads.png" />
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6 col-md-6 col-xl-6 pl-0 ">
                <div className="cardbox02">
                  <div className="panel-body new_leads bd-panel">
                    <h2>UnAssigned Lead</h2>
                    <p>60</p>
                  </div>
                  <div className="lead_img  align-items-center">
                    <img src="dist/img/lead_img.png" />
                  </div>
                </div></div>

            </div>
            <div className="row">
              {
                Array?.isArray(leadcountdata) ? (
                  leadcountdata?.map((leadcountdata1, index) => (
                    leadcountdata1?.name === 'Followup Lead' ? (
                      <div className="col-xs-6 col-sm-6 col-md-6 pl-0 dashboard-fixeds col-lg-4" key={index}>
                        <Link to="/followupleads">  <div className={`buttons-30 border-lefts${index + 1} mb-4`} role="button">
                          <div className="text-center pt-3">
                            <div className="flex items-center justify-center mx-auto text-red-500 bg-red-100 rounded-full size-14 dark:bg-red-500/20">
                              <i className="fa fa-solid fa-users text-red-500"></i>
                            </div>
                            <h5 className="mt-2 mb-2"><span className="counter-value">{leadcountdata1?.name}</span></h5>
                            <p className="text-slate-500 dark:text-zink-200">{leadcountdata1?.Value}</p>
                          </div>
                        </div></Link>
                      </div>
                    ) : leadcountdata1?.name === 'Total Agent' ? (
                      localStorage.getItem("role") === 'admin' ? (
                        <div className="col-xs-6 col-sm-6 col-md-6 pl-0 dashboard-fixeds col-lg-4" key={index}>
                          <Link to="/Setting">    <div className={`buttons-30 border-lefts${index + 1} mb-4`} role="button">
                            <div className="text-center pt-3">
                              <div className="flex items-center justify-center mx-auto  bg-green-100 rounded-full size-14 dark:bg-red-500/20">
                                <i className="fa fa-solid fa-user text-green-500"></i>
                              </div>
                              <h5 className="mt-2 mb-2"><span className="counter-value">{leadcountdata1?.name}</span></h5>
                              <p className="text-slate-500 dark:text-zink-200">{leadcountdata1?.Value}</p>
                            </div>
                          </div></Link>
                        </div>
                      ) : (<div className="col-xs-6 col-sm-6 col-md-6 pl-0 dashboard-fixeds col-lg-4" key={index}>
                        <Link to="#">    <div className={`buttons-30 border-lefts${index + 1} mb-4`} role="button">
                          <div className="text-center pt-3">
                            <div className="flex items-center justify-center mx-auto  bg-green-100 rounded-full size-14 dark:bg-red-500/20">
                              <i className="fa fa-solid fa-user text-green-500"></i>
                            </div>
                            <h5 className="mt-2 mb-2"><span className="counter-value">{leadcountdata1?.name}</span></h5>
                            <p className="text-slate-500 dark:text-zink-200">{leadcountdata1?.Value}</p>
                          </div>
                        </div></Link>
                      </div>)

                    ) : (
                      <div className="col-xs-6 col-sm-6 col-md-6 pl-0 dashboard-fixeds col-lg-4" key={index}>
                        <Link to={`/ImpSchedule/${leadcountdata1?.id}`}>    <div className={`button-30 border-lefts${index + 1} mb-4`} role="button">
                          <div className="text-center pt-3">
                            <div className="flex items-center justify-center mx-auto text-red-500 1 bg-custom-100 rounded-full size-14 dark:bg-red-500/20">
                              {index == 3 ? (<i className={`fa fa-solid fa-lightbulb-o text-custom-500 2`}>
                              </i>) : index == 4 ? (<i className={`fa fa-solid fa-calendar-check-o  text-purple-500 3`}></i>)
                                : index == 5 ? (<i className={`fa fa-solid fa-clock-o text-red-500 4`}></i>) :
                                  (<i className={`fa fa-solid fa-handshake-o text-custom-500 5`}></i>)}

                            </div>
                            <h5 className="mt-2 mb-2"><span className="counter-value">
                              {leadcountdata1?.name}</span></h5>
                            <p className="text-slate-500 dark:text-zink-200">{leadcountdata1?.Value} - {leadcountdata1?.Value1}</p>
                          </div>
                        </div></Link>
                      </div>

                    )
                  ))
                ) : (
                  <p>Loading or No Data</p>
                )
              }





            </div>
            <div className="row">


              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 pl-0">
                <div className="panel panel-bd cardbox2">
                  <div className="panel-body bd-panel">
                    <div className="statistic-box">
                      <div className="d-flex gap-2 align-items-center">
                        <div className="badge rounded bg-label-primary p-1"><i className="fa fa-money"></i></div>
                        <h6 className="mb-0">Yearly Sales</h6>
                      </div>
                      <h4>
                        {" "}
                        Rs.  {Sale['0']?.TotalAmountWon} (<span className="count-number"> {Sale['0']?.Yearly_lead_count_for_won} </span>){" "}
                      </h4>
                      <div className="progresse w-75" style={{ height: 4 }}>
                        <div
                          className="progress-bars"
                          role="progressbar"
                          style={{ width: "65%" }}
                          aria-valuenow={65}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4">
                <div className="panel panel-bd cardbox2">
                  <div className="panel-body bd-panel">
                    <div className="statistic-box">
                      <div className="d-flex gap-2 align-items-center">
                        <div className="badge rounded bg-label-info p-1"><i className="fa fa-money"></i></div>
                        <h6 className="mb-0">Monthly Sales</h6>
                      </div>
                      <h4 className="my-2 pt-1">  Rs. {Sale['0']?.TotalAmountwonmanthely} (<span className="count-number"> {Sale['0']?.wonleadforthirtyday_count_lead} </span>){" "}
                      </h4>
                      <div className="progresse w-75" style={{ height: 4 }}>
                        <div
                          className="progress-bars bg-infos"
                          role="progressbar"
                          style={{ width: "65%" }}
                          aria-valuenow={65}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4">
                <div className="panel panel-bd cardbox2">
                  <div className="panel-body bd-panel">
                    <div className="statistic-box">
                      <div className="d-flex gap-2 align-items-center">
                        <div className="badge rounded bg-label-danger p-1"><i className="fa fa-frown-o"></i></div>
                        <h6 className="mb-0">Miss opportunity</h6>
                      </div>
                      <h5 className="my-2 pt-1"> {" "}
                        Rs. {Sale['0']?.TotalAmountLost}  (
                        <span className="count-number"> {Sale['0']?.Yearly_lead_count_Lost} </span>){" "}</h5>
                      <div className="progresse w-75" style={{ height: 4 }}>
                        <div
                          className="progress-bars bg-danger"
                          role="progressbar"
                          style={{ width: "65%" }}
                          aria-valuenow={65}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              {/* <div
                className="col-xs-6 col-sm-6 col-md-6 col-lg-3"
                style={{ display: "none" }}
              >
                <div className="panel panel-bd cardbox3">
                  <div className="panel-body bd-panel">
                    <div className="statistic-box text-center">
                      {" "}
                      <i className="fa fa-tasks fa-2x" />
                      <h4>ToDo</h4>
                      <h3>
                        {" "}
                        <span className="count-number" style={{ color: "red" }}>
                          1
                        </span>
                        / <span className="count-number">1 </span>{" "}
                      </h3>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* <div
                className="col-xs-6 col-sm-6 col-md-6 col-lg-3"
                style={{ display: "none" }}
              >
                <div className="panel panel-bd cardbox3">
                  <div className="panel-body bd-panel">
                    <div className="statistic-box text-center">
                      {" "}
                      <i className="fa fa-comments fa-2x" />
                      <h4>SMS Status</h4>
                      <h3>
                        <span className="count-number"> 4249 </span>{" "}
                      </h3>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>

            {/* /.row */}
            {/* Main row */}

            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 pl-0">
                <div className="panel panel-bd lobidisable lobipanel lobipanel-sortable">
                  <div className="panel-heading ui-sortable-handle">
                    <div className="panel-title">
                      <h4>Calender</h4>
                      <div className="card card-primary">
                        <div className="card-body p-0">
                          <div id="calendar">
                            <MyCalendar />

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div className="panel panel-bd lobidisable lobipanel lobipanel-sortable">
                  <div className="panel-heading ui-sortable-handle">
                    <div className="panel-title">
                      <h4>Leads Source Overview</h4>
                      <Chart options={options} series={leadsourcedata1} type="pie" width="100%" />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-xs-12 col-sm-12 col-md-4 col-lg-4"
                style={{ display: "none" }}
              >
                <div className="panel panel-bd lobidisable lobipanel lobipanel-sortable">
                  <div className="panel-heading ui-sortable-handle">
                    <div className="panel-title">
                      <h4>Task</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 pl-0  lobipanel-parent-sortable ui-sortable"
                data-lobipanel-child-inner-id="JboVwpEyCD"
              >
                <div
                  className="panel panel-bd lobidrag bg-white lobipanel lobipanel-sortable"
                  data-inner-id="JboVwpEyCD"
                  data-index={0}
                >
                  <div className="panel-heading ui-sortable-handle">
                    <div
                      className="panel-title"
                    >
                      <h4>Income Graph</h4>
                    </div>
                  </div>
                  <div className="panel-bodyes personales">
                    <LineChart1 />
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 pl-0">
                <div className="panel panel-bd  bg-white">
                  <div className="panel-heading">
                    <div className="panel-title   d-flex justify-content-between">
                      <div className="card-title mb-0">
                        <h5 className="mb-0">   Employee Report</h5>
                        <p className="since_list">Since Last Year</p>

                      </div>
                      <div className="value_serve">
                        <div className="dropdown">
                          <button className="btn p-0" type="button" id="sourceVisits">
                            <i className="fa fa-ellipsis-v fa-sm text-muted"></i>
                          </button>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a className="dropdown-item" href="javascript:void(0);">Refresh</a>
                            <a className="dropdown-item" href="javascript:void(0);">Download</a>
                            <a className="dropdown-item" href="javascript:void(0);">View All</a>
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>

                  <div className="panel-body personal">
                    <div className="card-bodyes  ">
                      <ul className="p-0 m-0">
                        <li className="mb-1 d-flex justify-content-between align-items-center">
                          <div className="bg-label-success rounded">
                          </div>
                          <div className="d-flex justify-content-between w-100 flex-wrap">

                            <div className="d-flex">

                            </div>
                          </div>
                          <div className="d-flex justify-content-between w-100 flex-wrap">

                            <div className="d-flex">

                            </div>
                          </div>
                        </li>
                        {Detail?.map((Details, key) => {
                          const converttime = (ffgfgf) => {
                            const second = ffgfgf;
                            const hours = Math.floor(second / 3600);
                            const minutes = Math.floor((second % 3600) / 60);
                            const remainingSeconds = second % 60;
                            const timeconverted = hours + 'h ' + minutes + 'm ' + remainingSeconds + 's';
                            return timeconverted;
                          };
                          // Check if the user is a 'user' or not
                          const isUser = localStorage.getItem("role") === 'user';

                          // Check if the Details.user_id matches the logged-in user's user_id
                          const isCurrentUser = Details.user_id === localStorage.getItem("user_id");

                          if (isUser && isCurrentUser) {
                            return (
                              <li className="mb-3 d-flex justify-content-between align-items-center">
                                <div className="bg-label-success rounded">
                                  <img src="img/user_img.jpg" alt="User" className="rounded-circle me-3" width="28" />
                                </div>
                                <div className="d-flex justify-content-between w-100 flex-wrap">
                                  <h6 className="mb-0 ms-3">   {Details?.username}</h6>
                                  <div className="d-flex">
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between phone_btns w-100 flex-wrap">
                                  <h6 className="mb-0 ms-3"> <i className="fa fa-phone" aria-hidden="true"></i> {Details?.HigstNoOfCall}  </h6>
                                  <div className="d-flex">
                                  </div>
                                </div>
                                <div className="d-flex  w-30">
                                  <h6 className="mb-0 ms-3">
                                    <span className="badge badge-primary light border-0">{converttime(Details?.TotalTime)}</span></h6>
                                  <div className="d-flex">
                                  </div>
                                </div>
                              </li>
                            );
                          } else if (!isUser) {
                            // Render for non-user role
                            return (
                              <li className="mb-3 d-flex justify-content-between align-items-center">
                                <div className="bg-label-success rounded">
                                  <img src="img/user_img.jpg" alt="User" className="rounded-circle me-3" width="28" />
                                </div>
                                <div className="d-flex justify-content-between w-100 flex-wrap">
                                  <h6 className="mb-0 ms-3">   {Details?.username}</h6>
                                  <div className="d-flex">
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between phone_btns w-100 flex-wrap">
                                  <h6 className="mb-0 ms-3"> <i className="fa fa-phone" aria-hidden="true"></i> {Details?.HigstNoOfCall}  </h6>
                                  <div className="d-flex">
                                  </div>
                                </div>
                                <div className="d-flex  w-30">
                                  <h6 className="mb-0 ms-3">
                                    <span className="badge badge-primary light border-0">{converttime(Details?.TotalTime)}</span></h6>
                                  <div className="d-flex">
                                  </div>
                                </div>
                              </li>
                            );
                          } else {
                            return null; // Render nothing if not a user and not the current user
                          }


                        })}
                      </ul>
                    </div>

                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div className="panel panel-bd  bg-white">
                  <div className="panel-heading">
                    <div className="panel-title   d-flex justify-content-between">
                      <div className="card-title mb-0">
                        <h5 className="mb-0"> All Leads Information</h5>
                        <p className="since_list">Since Last Year</p>
                      </div>
                      <div className="value_serve">
                        <div className="dropdown">
                          <button className="btn p-0" type="button" id="sourceVisits">
                            <i className="fa fa-ellipsis-v fa-sm text-muted"></i>
                          </button>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a className="dropdown-item" href="javascript:void(0);">Refresh</a>
                            <a className="dropdown-item" href="javascript:void(0);">Download</a>
                            <a className="dropdown-item" href="javascript:void(0);">View All</a>
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>

                  <div className="panel-body personal">
                    <div className="card-bodyes  ">
                      <ul className="p-0 m-0">
                        <li className="mb-1 d-flex justify-content-between align-items-center">
                          <div className="bg-label-success rounded">
                          </div>


                        </li>
                        {LeadCount?.map((LeadCount1, key) => {
                          return (
                            <li className="mb-3 d-flex justify-content-between align-items-center">
                              <div className="badge bg-label-secondaryess p-2 me-3 rounded svg-icons-prev">
                                <i className="fab fa fa-user" aria-hidden="true"></i>
                              </div>
                              <div className="d-flex justify-content-between w-100 flex-wrap">
                                <h6 className="mb-0 ms-3">   {LeadCount1?.name}</h6>
                                <div className="d-flex">
                                </div>
                              </div>
                              <div className="d-flex justify-content-between w-100 flex-wrap">

                                <div className="d-flex">
                                </div>
                              </div>
                              <div className="d-flex  w-30">
                                <h6 className="mb-0 ms-3"> <span className="badge badge-primaryess light border-0">{LeadCount1?.Value}</span></h6>
                                <div className="d-flex">
                                </div>
                              </div>
                            </li>


                          );
                        })}
                      </ul>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div className="row pt-3">
              <div className="col-xs-12 col-sm-12 col-md-4 pl-0">
                <div className="panel panel-bd bg-white">
                  <div className="panel-heading">
                    <div className="panel-title d-flex">
                      <h5>Best Value Services</h5>
                      <div className="value_serve">
                        <div className="dropdown">
                          <button className="btn p-0" type="button" id="sourceVisits">
                            <i className="fa fa-ellipsis-v fa-sm text-muted"></i>
                          </button>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a className="dropdown-item" href="javascript:void(0);">Refresh</a>
                            <a className="dropdown-item" href="javascript:void(0);">Download</a>
                            <a className="dropdown-item" href="javascript:void(0);">View All</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ul className="p-0 m-0 pt-3">
                      <li className="d-flex align-items-center mb-4">
                        <div class="badge bg-label-primary me-3 rounded p-2">
                          <i class="fa fa-wallet fa-sm"></i>
                        </div>
                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                          <div className="me-2">
                            <div className="d-flex align-items-center">
                              <h6 className="mb-0 me-1">E-Commerce</h6>
                            </div>

                          </div>
                          <div className="user-progress">
                            <p className="text-success fw-medium mb-0 d-flex justify-content-center gap-1">
                              {/* Rs. 15000.00  */}

                            </p>
                          </div>
                        </div>
                      </li>
                      <li className="d-flex align-items-center mb-4">
                        <div class="badge bg-label-primary me-3 rounded p-2">
                          <i class="fa fa-wallet fa-sm"></i>
                        </div>
                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                          <div className="me-2">
                            <div className="d-flex align-items-center">
                              <h6 className="mb-0 me-1">Real-Estate</h6>
                            </div>

                          </div>
                          <div className="user-progress">
                            <p className="text-danger fw-medium mb-0 d-flex justify-content-center gap-1">
                              {/* Rs. 15000.00  */}
                            </p>
                          </div>
                        </div>
                      </li>

                      <li className="d-flex align-items-center mb-4">
                        <div class="badge bg-label-primary me-3 rounded p-2">
                          <i class="fa fa-wallet fa-sm"></i>
                        </div>
                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                          <div className="me-2">
                            <div className="d-flex align-items-center">
                              <h6 className="mb-0 me-1">WhatsApp</h6>
                            </div>

                          </div>
                          <div className="user-progress">
                            <p className="text-success fw-medium mb-0 d-flex justify-content-center gap-1">
                              {/* Rs. 15000.00  */}
                            </p>
                          </div>
                        </div>
                      </li>
                      <li className="d-flex align-items-center mb-4">
                        <div class="badge bg-label-primary me-3 rounded p-2">
                          <i class="fa fa-wallet fa-sm"></i>
                        </div>
                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                          <div className="me-2">
                            <div className="d-flex align-items-center">
                              <h6 className="mb-0 me-1">Web Maintenance Qtly</h6>
                            </div>

                          </div>
                          <div className="user-progress">
                            <p className="text-success fw-medium mb-0 d-flex justify-content-center gap-1">
                              {/* Rs. 15000.00  */}
                            </p>
                          </div>
                        </div>
                      </li>
                      <li className="d-flex align-items-center mb-4">
                        <div class="badge bg-label-primary me-3 rounded p-2">
                          <i class="fa fa-wallet fa-sm"></i>
                        </div>
                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                          <div className="me-2">
                            <div className="d-flex align-items-center">
                              <h6 className="mb-0 me-1">Website Maintenance</h6>
                            </div>

                          </div>
                          <div className="user-progress">
                            <p className="text-success fotns_sizee fw-medium mb-0 d-flex align-items-center gap-1">
                              {/* Rs. 15000.00  */}
                            </p>
                          </div>
                        </div>
                      </li>

                    </ul>
                  </div>
                  <div className="panel-body personal Best Value d-none Services Best Value Services">
                    <ul className="emply bg-white" id="bvslist">
                      <li>1. E-Commerce (Rs. 15000.00)</li>
                      <li>2. (Rs. 0)</li>
                      <li>3. Real-Estate (Rs. 0)</li>
                      <li>4. WhatsApp (Rs. 0)</li>
                      <li>5. Website Maintenance Qtly (Rs. 0)</li>
                      <li>6. Website Maintenance (Rs. 0)</li>
                      <li>7. Web Hosting (Rs. 0)</li>
                      <li>8. Web Designing Development (Rs. 0)</li>
                      <li>9. Test Razor Pay (Rs. 0)</li>
                      <li>10. Staff Management Fee (Rs. 0)</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                <div className="panel panel-bd bg-white">
                  <div className="panel-heading">
                    <div className="panel-title">
                      <h5>System Information</h5>
                    </div>
                  </div>
                  <div className="panel-body">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>Current Version</td>
                          <th>18.2.0</th>
                        </tr>
                        <tr>
                          <td>Latest Version</td>
                          <th>18.4.0</th>
                        </tr>
                        <tr>
                          <td>React Version</td>
                          <th>18.2.0</th>
                        </tr>
                        <tr>
                          <td>Node Version</td>
                          <th>18.2.0</th>
                        </tr>
                        <tr>
                          <td>SignUp Date</td>
                          <th>01-01-2021 11:44:29 AM</th>
                        </tr>



                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div
                className="col-xs-12 col-sm-12 col-md-4 col-lg-4 lobipanel-parent-sortable ui-sortable"
                data-lobipanel-child-inner-id="gjY82eGUtA"
              >
                <div
                  className="panel panel-bd bg-white lobidrag lobipanel lobipanel-sortable"
                  data-inner-id="gjY82eGUtA"
                  data-index={0}
                >
                  <div className="panel-heading ui-sortable-handle">
                    <div
                      className="panel-title"
                      style={{ maxWidth: "calc(100% - 0px)" }}
                    >
                      <h5>Next Version Features</h5>
                    </div>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled mb-0">
                      <li className="mb-3 pb-1">
                        <div className="d-flex align-items-start">
                          <div className="badge bg-label-secondary p-2 me-3 rounded">
                            <i className="fa fa-globe fa-sm" />
                          </div>
                          <div className="d-flex justify-content-between w-100 flex-wrap gap-2">
                            <div className="me-2">
                              <h6 className="mb-0">Geo Tracking</h6>
                              {/* <small className="text-muted">Direct link click</small> */}
                            </div>
                            <div className="d-flex align-items-center">
                              {/* <p className="mb-0">1.2k</p>
                          <div className="ms-3 badge bg-label-success">+4.2%</div> */}
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="mb-3 pb-1">
                        <div className="d-flex align-items-start">
                          <div className="badge bg-label-secondary p-2 me-3 rounded">
                            <i className="fa fa-globe fa-sm" />
                          </div>
                          <div className="d-flex justify-content-between w-100 flex-wrap gap-2">
                            <div className="me-2">
                              <h6 className="mb-0">SMS Integration</h6>

                            </div>
                            <div className="d-flex align-items-center">
                              {/* <p className="mb-0">31.5k</p>
                          <div className="ms-3 badge bg-label-success">+8.2%</div> */}
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="mb-3 pb-1">
                        <div className="d-flex align-items-start">
                          <div className="badge bg-label-secondary p-2 me-3 rounded">
                            <i className="fa fa-envelope fa-sm" />
                          </div>
                          <div className="d-flex justify-content-between w-100 flex-wrap gap-2">
                            <div className="me-2">
                              <h6 className="mb-0">WhatsApp Integration</h6>

                            </div>
                            <div className="d-flex align-items-center">
                              {/* <p className="mb-0">893</p>
                          <div className="ms-3 badge bg-label-success">+2.4%</div> */}
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="mb-3 pb-1">
                        <div className="d-flex align-items-start">
                          <div className="badge bg-label-secondary p-2 me-3 rounded">
                            <i className="fa fa-globe  fa-sm" />
                          </div>
                          <div className="d-flex justify-content-between w-100 flex-wrap gap-2">
                            <div className="me-2">
                              <h6 className="mb-0">Calling Through System</h6>

                            </div>
                            <div className="d-flex align-items-center">
                              {/* <p className="mb-0">342</p>
                          <div className="ms-3 badge bg-label-danger">-0.4%</div> */}
                            </div>
                          </div>
                        </div>
                      </li>

                      <li className="mb-3 pb-1">
                        <div className="d-flex align-items-start">
                          <div className="badge bg-label-secondary p-2 me-3 rounded">
                            <i className="fa fa-globe  fa-sm" />
                          </div>
                          <div className="d-flex justify-content-between w-100 flex-wrap gap-2">
                            <div className="me-2">
                              <h6 className="mb-0">IOS App</h6>

                            </div>
                            <div className="d-flex align-items-center">
                              {/* <p className="mb-0">342</p>
                          <div className="ms-3 badge bg-label-danger">-0.4%</div> */}
                            </div>
                          </div>
                        </div>
                      </li>


                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* /.row (main row) */}
          </div>
          {/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>
    </div>
  );
}

export default Home;
