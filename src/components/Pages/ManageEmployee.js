import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getAllAgent } from "../../features/agentSlice";
import { Link } from "react-router-dom";
import axios from "axios";
function ManageEmployee() {
  var { message, agent, loading } = useSelector((state) => state.agent);
  const dispatch = useDispatch();
  const apiUrl = process.env.REACT_APP_API_URL;
  const DBuUrl = process.env.REACT_APP_DB_URL;
  const [Detail, setDetail] = useState([]);
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
  const [adSerch, setAdvanceSerch] = useState([]);
  useEffect(() => {

    if (localStorage.getItem("role") === 'admin') {
      getHigstNoOfCall();
    }
    if (localStorage.getItem("role") === "TeamLeader") {
      GetUserCallAccordingToTeamLeader(localStorage.getItem("user_id"))
    }
    if (localStorage.getItem("role") === 'user') {
      getHigstNoOfCall();
    }
  }, []);
  const Refresh = () => {
    setTimeout(() => {
      window.location.reload(false);
    }, 500);
  };

  const AdvanceSerch = async (e) => {
    e.preventDefault();
    console.log(adSerch);
    fetch(`${apiUrl}/GetAllUserCallLogByDateWise/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "mongodb-url": DBuUrl,
      },
      body: JSON.stringify(adSerch),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response from server:", data);
        setDetail(data?.array);

      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  return (
    <div>
      <div className="content-wrapper">
        {/* Main content */}
        <section className="content py-2">
          <div className="container">


            <div className="panel panel-bd lobidrag lobipanel">
              <div className="panel-heading">
                <div className="btn-groupes">

                  <div className="col-md-12 advS">
                    <form onSubmit={AdvanceSerch}>
                      <div className="row">
                        <h4 className="pt_2">Manage Employees </h4>
                        <div className="col-md-2">
                          <div className="form-group">
                            <input
                              type="date"
                              placeholder="Date To"
                              className="form-control"
                              onChange={(e) =>
                                setAdvanceSerch({ ...adSerch, start_date: e.target.value })
                              }
                              name="startDate"
                            />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="form-group">
                            <input
                              type="date"
                              placeholder="Date Till"
                              onChange={(e) =>
                                setAdvanceSerch({ ...adSerch, end_date: e.target.value })
                              }
                              className="form-control"
                              name="endDate"
                            />
                          </div>
                        </div>

                        <div className="col-md-2">
                          <div className="form-group">
                            <button
                              type="submit"
                              className="button-57 refersh_btn"
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="form-group">
                            <button
                              onClick={Refresh}
                              className="button-57 bg_colores "
                            >
                              Refresh
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>

                </div>
              </div>
              <div classname=" ">
                <div className="panel-bodyes bg-white">
                  <div className="cards">
                    <div className="table-responsive mob-bord">
                      <table className="table table-bordered table-hover" id="example">
                        <thead>
                          <tr>
                            <th>Sr. No.</th>
                            <th>User</th>
                            <th>Higstest No Of Call</th>
                            <th>Total Duration</th>
                            <th>Average Call Duration</th>
                          </tr>
                        </thead>
                        <tbody>
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

                            // Conditionally render the table row based on user role and user_id
                            if (isUser && isCurrentUser) {
                              return (
                                <tr key={key}>
                                  <td>{key + 1}</td>
                                  <td><Link to={`/call_log_details/${Details?.user_id}`}>{Details?.username}</Link></td>
                                  <td><Link to={`/call_log_details/${Details?.user_id}`}>{Details.HigstNoOfCall}</Link></td>
                                  <td><Link to={`/call_log_details/${Details?.user_id}`}>{converttime(Details.TotalTime)}</Link></td>
                                  <td>{converttime(Details.AvrageTime)}</td>
                                </tr>
                              );
                            } else if (!isUser) {
                              // Render for non-user role
                              return (
                                <tr key={key}>
                                  <td>{key + 1}</td>
                                  <td><Link to={`/call_log_details/${Details?.user_id}`}>{Details?.username}</Link></td>
                                  <td><Link to={`/call_log_details/${Details?.user_id}`}>{Details.HigstNoOfCall}</Link></td>
                                  <td><Link to={`/call_log_details/${Details?.user_id}`}>{converttime(Details.TotalTime)}</Link></td>
                                  <td>{converttime(Details.AvrageTime)}</td>
                                </tr>
                              );
                            } else {
                              return null; // Render nothing if not a user and not the current user
                            }
                          })}
                        </tbody>

                      </table>


                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </section>
      </div>

    </div>
  );
}
export default ManageEmployee;
