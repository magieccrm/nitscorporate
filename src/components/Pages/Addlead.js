import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductService } from "../../features/product_serviceSlice";
import { getAllLeadSource } from "../../features/leadSource";
import { getAllCountry } from "../../features/country_stateSlice";
import { getStatebycountry } from "../../features/getStateByCountrySlice";
import { toast } from "react-toastify";
import { getAllStatus } from "../../features/statusSlice";
import { addlead } from "../../features/leadSlice";
import { getAllAgent,getAllAgentWithData } from "../../features/agentSlice";
import Loader from "../Loader";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Addlead() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const DBuUrl = process.env.REACT_APP_DB_URL;
  const formRef = React.useRef(null);
  const [required, setRequired] = useState({ required: true });
  const [leaddata, setleaddata] = useState({ contact_no: "" });
  const { ProductService } = useSelector((state) => state.ProductService);
  const { leadSourcedata } = useSelector((state) => state.leadSource);
  const { Statusdata } = useSelector((state) => state.StatusData);
  const { CountryState } = useSelector((state) => state.Country_State);
  const { StateByCountry } = useSelector((state) => state.getStateByCountry);
  const { message, loading } = useSelector((state) => state.lead);
  const { agent } = useSelector((state) => state.agent);
  const user_id = localStorage.getItem("user_id");
  const dispatch = useDispatch();
  const handleInputChange = (e) => {
    setleaddata({ ...leaddata, country: e.target.value });
    getStateByCountry(e.target.value);
  };
  const navigate = useNavigate();
  //// For Show Product And Service

  const handleContactNoChange = (e) => {
    const inputValue = e.target.value;

    // Remove non-numeric characters
    const numericValue = inputValue.replace(/\D/g, "");

    // Restrict the length to 10 digits
    const limitedValue = numericValue.slice(0, 10);

    // Update state with the sanitized value
    setleaddata({
      ...leaddata,
      contact_no: limitedValue,
    });
  };
  const submitLead = async (e) => {
    e.preventDefault();
    const length = leaddata?.contact_no?.length;
    const length1 = leaddata?.alternative_no?.length;

    if (length < 10) {
      return toast.warn("PlZ Enter 10 Digit Contact No");
    }
    if (length1 < 10 && length1 >= 1) {
      return toast.warn("PlZ Enter 10 Digit Alternative No");
    }

    const buttonValue = e.nativeEvent.submitter.value;

    if (localStorage.getItem("role") === "user") {
      const updatedLeadData = await {
        ...leaddata,
        assign_to_agent: localStorage.getItem("user_id"),
        commented_id:localStorage.getItem("user_id"),
      };
      const aaaa = await dispatch(addlead(updatedLeadData));
      if (aaaa.payload.success == true) {
        toast.success(aaaa.payload.message);
        if (buttonValue === "save") {
          navigate("/leads");
        }
      } else {
        toast.warn(aaaa.payload?.message);
      }
    } else {
      const updatedLeadData = await {
        ...leaddata,
        commented_id:localStorage.getItem("user_id"),
      };
      const aaaa = await dispatch(addlead(updatedLeadData));
      if (aaaa.payload.success == true) {
        toast.success(aaaa.payload.message);
        if (buttonValue === "save") {
          navigate("/leads");
        }
      } else {
        toast.warn(aaaa.payload?.message);
      }
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        // await new Promise(resolve => setTimeout(resolve, 2000));
        dispatch(getAllProductService());
        dispatch(getAllLeadSource());
        // dispatch(getAllStatus());
        // dispatch(getAllCountry());
        // dispatch(getAllAgent());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const fetchData1 = async () => {
      try {
        // await new Promise(resolve => setTimeout(resolve, 2000));
        // dispatch(getAllProductService());
        // dispatch(getAllLeadSource());
        dispatch(getAllStatus());
        dispatch(getAllCountry());
        // await new Promise(resolve => setTimeout(resolve, 2000));
        if(localStorage.getItem("role")==='admin'){ 
          dispatch(getAllAgent());
        }
        if(localStorage.getItem("role")==='TeamLeader'){
          dispatch(getAllAgentWithData({assign_to_agent:localStorage.getItem("user_id")}));
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData1();
    fetchData();
  }, []);

  const getStateByCountry = (data) => {
    dispatch(getStatebycountry(data));
  };
  if (loading) {
    return <Loader />;
  }



  return (
    <div>
      <div className="content-wrapper">
        {/* Main content */}
        <section className="content content-header  py-5">
          <div className="container">
            <div className="panel panel-bd lobidrag lobipanel">
              <div className="panel-heading">
                <div className="btn-group bg-white ">
                  <h4>Add Lead </h4>
                </div>

                <button
                  type="button"
                  style={{ float: "right" }}
                  className="btn btn-sm btn-primaryess"
                  data-toggle="modal"
                  data-target="#custome"
                >
                  <Link className="btn btnes exports" to="/import-lead">
                     <i className="fa fa-download" />
                    &nbsp; Import{" "}
                  </Link>
                </button>
              </div>

              <div className="panel-body bg-white mt-4">
                <form onSubmit={submitLead}>
                  <div className="row">
                    <input type="hidden" name="client_id" value={user_id} />
                    <div className="col-md-6  mob-left-right col-xs-12">
                      <div className="row">
                        <div className="col-md-4 pd-top mobile-hids">
                          <label htmlFor="full_name">
                            Full Name <span className="text-danger">*</span>{" "}
                          </label>
                        </div>
                        <div className="col-md-8 mob-left-right col-xs-12">
                          <div className="form-group">
                            <input
                              type="text"
                              name="full_name"
                              onChange={(e) =>
                                setleaddata({
                                  ...leaddata,
                                  full_name: e.target.value,
                                })
                              }
                              placeholder="Full Name"
                              className="form-control"
                              required="required"
                            />
                            <span className="text-danger ferror"> </span>{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6   mob-left-right col-xs-12">
                      <div className="row">
                        <div className="col-md-4 pd-top mobile-hids">
                          <label htmlFor="email_id">Email Id </label>
                        </div>
                        <div className="col-md-8 mob-left-right col-xs-12">
                          <div className="form-group">
                            <input
                              type="email"
                              name="email_id"
                              onChange={(e) =>
                                setleaddata({
                                  ...leaddata,
                                  email_id: e.target.value,
                                })
                              }
                              placeholder="Email Id"
                              className="form-control"
                            />
                            <span className="text-danger ferror"> </span>{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6   mob-left-right col-xs-12">
                      <div className="row">
                        <div className="col-md-4 pd-top mobile-hids">
                          <label htmlFor="lead_source">Lead Source </label>
                        </div>
                        <div className="col-md-8 mob-left-right col-xs-12">
                          <div className="form-group">
                            <select
                              name="lead_source"
                              onChange={(e) =>
                                setleaddata({
                                  ...leaddata,
                                  lead_source: e.target.value,
                                })
                              }
                              className="form-control"
                              required
                            >
                              <option value="">Select</option>

                              {leadSourcedata?.leadSource?.map(
                                (leadsource, key) => {
                                  return (
                                    <option value={leadsource._id}>
                                      {leadsource?.lead_source_name}
                                    </option>
                                  );
                                }
                              )}
                            </select>
                            <span className="text-danger ferror"> </span>{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6  mob-left-right col-xs-12">
                      <div className="row">
                        <div className="col-md-4 pd-top mobile-hids">
                          <label htmlFor="contact_no">
                            Contact No <span className="text-danger">*</span>{" "}
                          </label>
                        </div>
                        <div className="col-md-8 mob-left-right col-xs-12">
                          <div className="form-group">
                            <input
                              type="number"
                              pattern="[0-9]{10}"
                              name="contact_no"
                              onChange={handleContactNoChange}
                              value={leaddata.contact_no}
                             
                              placeholder="Contact No"
                              className="form-control"
                              required="required"
                            />
                            <span className="text-danger ferror"> </span>{" "}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6  mob-left-right col-xs-12">
                      <div className="row">
                        <div className="col-md-4 pd-top mobile-hids">
                          <label htmlFor="service">Product & Service </label>
                        </div>
                        <div className="col-md-8 mob-left-right col-xs-12">
                          <div className="form-group">
                            <select
                              name="service"
                              onChange={(e) =>
                                setleaddata({
                                  ...leaddata,
                                  service: e.target.value,
                                })
                              }
                              className="form-control"
                              required
                            >
                              <option value="">Select</option>
                              {ProductService?.product_service?.map(
                                (service, key) => {
                                  return (
                                    <option value={service._id}>
                                      {service?.product_service_name}
                                    </option>
                                  );
                                }
                              )}
                            </select>
                            <span className="text-danger ferror"> </span>{" "}
                          </div>
                        </div>

                        <div className="col-md-4 pd-top mobile-hids">
                          <label htmlFor="description">Description </label>
                        </div>
                        <div className="col-md-8 mob-left-right col-xs-12  form-group">
                          <textarea
                            name="description"
                            cols={40}
                            rows={3}
                            onChange={(e) =>
                              setleaddata({
                                ...leaddata,
                                description: e.target.value,
                              })
                            }
                            className="form-control"
                          />
                          <span className="text-danger ferror"> </span>{" "}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6  mob-left-right col-xs-12">
                      <div className="row">
                        <div className="col-md-4 pd-top mobile-hids">
                          <label htmlFor="followup">Followup Date</label>
                        </div>
                        <div className="col-md-8 mob-left-right col-xs-12  form-group">
                          <input
                            type="datetime-local"
                            name="followup_date"
                            onChange={(e) =>
                              setleaddata({
                                ...leaddata,
                                followup_date: e.target.value,
                              })
                            }
                            tabIndex={20}
                            className="form-control"
                            autoComplete="off"
                            required
                          />
                        </div>

                        {localStorage.getItem("role") == "admin" ? (
                          <>
                            <div className="col-md-4 pd-top mobile-hids">
                              <label htmlFor="assign_to_agent">
                                Assign to agent
                              </label>
                            </div>
                            <div className="col-md-8 mob-left-right col-xs-12  form-group">
                              <select
                                name="assign_to_agent"
                                onChange={(e) =>
                                  setleaddata({
                                    ...leaddata,
                                    assign_to_agent: e.target.value,
                                  })
                                }
                                className="form-control"
                                required
                              >
                                <option value="">Select</option>

                                {agent?.agent?.map((agents, key) => {
                                  return (
                                    <option value={agents._id}>
                                      {agents.agent_name}
                                    </option>
                                  );
                                })}
                              </select>
                              <span className="text-danger ferror"> </span>
                            </div>
                          </>
                        ) : localStorage.getItem("role") == "TeamLeader"?(
                          <>
                            <div className="col-md-4 pd-top mobile-hids">
                              <label htmlFor="assign_to_agent">
                                Assign to agent
                              </label>
                            </div>
                            <div className="col-md-8 mob-left-right col-xs-12  form-group">
                              <select
                                name="assign_to_agent"
                                onChange={(e) =>
                                  setleaddata({
                                    ...leaddata,
                                    assign_to_agent: e.target.value,
                                  })
                                }
                                className="form-control"
                                required
                              >
                                <option value="">Select</option>

                                {agent?.agent?.map((agents, key) => {
                                  return (
                                    <option value={agents._id}>
                                      {agents.agent_name}
                                    </option>
                                  );
                                })}
                              </select>
                              <span className="text-danger ferror"> </span>
                            </div>
                          </>
                         ):("")}

                        <div className="col-md-4 pd-top mobile-hids">
                          <label htmlFor="status">
                            Status <span className="text-danger">*</span>{" "}
                          </label>
                        </div>
                        <div className="col-md-8 mob-left-right col-xs-12 form-group">
                          <select
                            name="status"
                            className="form-control"
                            onChange={(e) =>
                              setleaddata({
                                ...leaddata,
                                status: e.target.value,
                              })
                            }
                            required
                          >
                            <option value="">Select</option>

                            {Statusdata?.leadstatus?.map((status, key) => {
                              return (
                                <option value={status._id}>
                                  {status.status_name}
                                </option>
                              );
                            })}
                          </select>
                          <span className="text-danger ferror"> </span>{" "}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6  mob-left-right col-xs-12">
                      <div className="row"></div>
                    </div>
                    <div className="col-md-6 mob-left-right col-xs-12">
                      <div className="row">
                        {/* <div className="col-md-4 pd-top mobile-hids">
                        <label htmlFor="position">Position </label>
                      </div>
                      <div className="col-md-8 mob-left-right col-xs-12">
                        <div className="form-group">
                          <input
                            type="text"
                            name="position"
                            onChange={(e) =>
                              setleaddata({
                                ...leaddata,
                                position: e.target.value,
                              })
                            }
                            placeholder="Position"
                            className="form-control"
                            tabIndex={8}
                            autoComplete="off"
                          />
                          <span className="text-danger ferror"> </span>{" "}
                        </div>
                      </div> */}
                      </div>
                    </div>
                    <div className="col-md-6  mob-left-right col-xs-12">
                      <div className="row"></div>
                    </div>
                    <div className="col-md-12 mob-left-right col-xs-12">
                      <div className="row">
                        <div className="col-md-12 mob-left-right col-xs-12">
                          <button
                            type="button"
                            className="d-flex align-items-center w-100 bg-blue justify-content-between btn btn-link collapsed"
                            data-toggle="collapse"
                            data-target="#collapseOne"
                            aria-expanded="false"
                            aria-controls="collapseOne"
                          >
                            Additional Information
                            <span className="fa-stack fa-sm">
                              <i className="fas fa-circle fa-stack-2x" />
                              <i className="fas fa-plus bg-black  fa-stack-1x fa-inverse" />
                            </span>
                          </button>
                        </div>
                      </div>

                      <div
                        id="collapseOne"
                        className="collapse"
                        aria-labelledby="headingOne"
                      >
                        <div className="card-body">
                          <div className="row">
                            <div className="col-sm-6   mob-left-right col-xs-12">
                              <div className="row">
                                <div className="col-12 address_information">
                                  {/* <div className="address-sec"> Address </div> */}
                                </div>

                                <div className="col-md-4 pd-top mobile-hids">
                                  <label htmlFor="full_address">
                                    Full Address{" "}
                                  </label>
                                </div>
                                <div className="col-md-8 mob-left-right col-xs-12  form-group">
                                  <textarea
                                    name="full_address"
                                    cols={40}
                                    rows={3}
                                    onChange={(e) =>
                                      setleaddata({
                                        ...leaddata,
                                        full_address: e.target.value,
                                      })
                                    }
                                    className="form-control"
                                  />
                                  <span className="text-danger ferror"> </span>{" "}
                                </div>

                                <div className="col-md-4 pd-top mobile-hids">
                                  <label htmlFor="country">Country </label>
                                </div>
                                <div className="col-md-8 mob-left-right col-xs-12  form-group">
                                  <select
                                    name="country"
                                    onChange={handleInputChange}
                                    //  onChange={e => getStateByCountry(e.target.value)}
                                    className="form-control"
                                    tabIndex={11}
                                  >
                                    <option value="">Select</option>
                                    {CountryState?.country?.map(
                                      (country1, key) => {
                                        return (
                                          <option value={country1.isoCode}>
                                            {country1.name}{" "}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                  <span className="text-danger ferror"> </span>{" "}
                                </div>

                                <div className="col-md-4 pd-top mobile-hids">
                                  <label htmlFor="state">State </label>
                                </div>
                                <div className="col-md-8 mob-left-right col-xs-12  form-group">
                                  <select
                                    name="state"
                                    onChange={(e) =>
                                      setleaddata({
                                        ...leaddata,
                                        state: e.target.value,
                                      })
                                    }
                                    className="form-control"
                                  >
                                    <option value="">Select</option>
                                    {StateByCountry?.state?.map(
                                      (state1, key) => {
                                        return (
                                          <option value={state1.name}>
                                            {state1.name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                  <span className="text-danger ferror"> </span>{" "}
                                </div>
                                <div className="col-md-4 pd-top mobile-hids">
                                  <label htmlFor="city">City </label>
                                </div>
                                <div className="col-md-8 mob-left-right col-xs-12  form-group">
                                  <input
                                    type="text"
                                    name="city"
                                    onChange={(e) =>
                                      setleaddata({
                                        ...leaddata,
                                        city: e.target.value,
                                      })
                                    }
                                    placeholder="City"
                                    className="form-control"
                                    tabIndex={14}
                                    autoComplete="off"
                                  />
                                  <span className="text-danger ferror"> </span>{" "}
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6  mob-left-right col-xs-12">
                              <div className="row">
                                {/* <div className="address_information newaddress">
                                  <div className="address-sec">
                                    {" "}
                                    Additional Information{" "}
                                  </div>
                                </div> */}
                              </div>

                              <div className="row">
                                <div className="col-md-4 pd-top mobile-hids">
                                  <label htmlFor="website">Website </label>
                                </div>
                                <div className="col-md-8 mob-left-right col-xs-12">
                                  <div className="form-group">
                                    <input
                                      type="text"
                                      name="website"
                                      onChange={(e) =>
                                        setleaddata({
                                          ...leaddata,
                                          website: e.target.value,
                                        })
                                      }
                                      placeholder="Website"
                                      className="form-control"
                                      tabIndex={4}
                                      autoComplete="off"
                                    />
                                    <span className="text-danger ferror">
                                      {" "}
                                    </span>{" "}
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-4 pd-top mobile-hids">
                                  <label htmlFor="company_name">
                                    Company Name{" "}
                                  </label>
                                </div>
                                <div className="col-md-8 mob-left-right col-xs-12">
                                  <div className="form-group">
                                    <input
                                      type="text"
                                      name="company_name"
                                      onChange={(e) =>
                                        setleaddata({
                                          ...leaddata,
                                          company_name: e.target.value,
                                        })
                                      }
                                      placeholder="Company Name"
                                      className="form-control ui-autocomplete-input"
                                      tabIndex={3}
                                      autoComplete="off"
                                    />
                                    <span className="text-danger ferror">
                                      {" "}
                                    </span>{" "}
                                  </div>
                                </div>

                                <div className="col-md-4 pd-top mobile-hids">
                                  <label htmlFor="lead_cost">Lead Cost </label>
                                </div>
                                <div className="col-md-8 mob-left-right col-xs-12">
                                  <div className="form-group">
                                    <input
                                      type="number"
                                      name="lead_cost"
                                      onChange={(e) =>
                                        setleaddata({
                                          ...leaddata,
                                          lead_cost: e.target.value,
                                        })
                                      }
                                      placeholder="Lead Cost"
                                      className="form-control"
                                      tabIndex={10}
                                      autoComplete="off"
                                    />
                                    <span className="text-danger ferror">
                                      {" "}
                                    </span>{" "}
                                  </div>
                                </div>

                                <div className="col-md-4 pd-top mobile-hids">
                                  <label htmlFor="alternative_no">
                                    Alternative No{" "}
                                  </label>
                                </div>
                                <div className="col-md-8 mob-left-right col-xs-12">
                                  <div className="form-group">
                                    <input
                                      type="number"
                                      name="alternative_no"
                                      pattern="[0-9]{10}"
                                      onChange={(e) =>
                                        setleaddata({
                                          ...leaddata,
                                          alternative_no: e.target.value,
                                        })
                                      }
                                      placeholder="Alternative No"
                                      className="form-control"
                                      tabIndex={7}
                                      autoComplete="off"
                                    />
                                    <span className="text-danger ferror">
                                      {" "}
                                    </span>{" "}
                                  </div>
                                </div>
                                <div className="col-md-4 pd-top mobile-hids">
                                  <label htmlFor="pincode">Pincode </label>
                                </div>
                                <div className="col-md-8 mob-left-right col-xs-12  form-group">
                                  <input
                                    type="number"
                                    name="pincode"
                                    onChange={(e) =>
                                      setleaddata({
                                        ...leaddata,
                                        pincode: e.target.value,
                                      })
                                    }
                                    placeholder="Pincode"
                                    className="form-control"
                                    tabIndex={15}
                                    autoComplete="off"
                                  />
                                  <span className="text-danger ferror"> </span>{" "}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-sm-6 row mob-left-right col-xs-12 ">
                      <div className="row mob-left-right form-group">
                       
                      </div>

                      <div className="col-md-5">
                      
                      </div>
                      <input type="hidden" name="isAddNew" autoComplete="off" />
                      
</div></div>
<div className="row text-center pt-3">
                      <div className="col-md-12 col-xs- max-auto py-10 pt-10 ">
                      <input
                          type="submit"
                          value="AddAnother"
                          name="AddAnother"
                          style={{ marginRight: "10px" }}
                          className="button-57 bg_buttonsd"
                        />
                        <input
                          type="submit"
                          value="save"
                          name="save"
                          className="button-57 buttons_sdsre"
                        />
                       
                      
                    </div>
                    </div>
                  
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Addlead;
