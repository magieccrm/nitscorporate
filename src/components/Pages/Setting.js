import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addleadSource,
  getAllLeadSource,
  DeleteLeadSource,
  EditLeadSourceDetails,
} from "../../features/leadSource";
import { toast } from "react-toastify";
import {
  addStatus,
  getAllStatus,
  deleteStatus,
  EditStatusDetails,
} from "../../features/statusSlice";
import {
  addagent,
  getAllAgent,
  deleteAgent,
  checkedAgent,
  EditAgentDetails,
} from "../../features/agentSlice";
import {
  addLostReason,
  getAllLostReason,
  deleteLostReason,
  EditLostReason,
} from "../../features/lostreasonSlice";
import Loader from "../Loader";
import axios from "axios";
function Setting() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const DBuUrl = process.env.REACT_APP_DB_URL;
  const [idToDelete, setIdToDelete] = useState();
  const [idToDelete1, setIdToDelete1] = useState();

  const LeadTransfer = async (e) => {
    e.preventDefault();
    const dataleadtran = await { 'totransfer': idToDelete1?.agent_id, 'oftransfer': idToDelete }
    try {
      const response = await axios.put(
        `${apiUrl}/LeadTransfer/`,
        dataleadtran
      );
      if (response.data.success === true) {
        window.$('#exampleModal').modal('hide');
        toast.success(response?.data?.message);
        dispatch(deleteAgent(idToDelete));
   }
     } catch (error) {
      console.log('error',error);
      if (error.response.data.message=='Please select leads') {
        window.$('#exampleModal').modal('hide');
        toast.success('Leads have been transferred successfully.');  
        dispatch(deleteAgent(idToDelete));
    }
    
      console.log(error);
    }
  }
  const removeSite = async (_id) => {
    const confirmDelete1 = window.confirm(
      "Are you sure you want to delete this agent?"
    );
    if (confirmDelete1) {
      setIdToDelete(_id);
      window.$('#exampleModal').modal('show');
    } else {
      toast.success("Delete Canceled");
      console.log("Delete canceled");
    }
  };

  const { leadSourcedata } = useSelector((state) => state?.leadSource);
  var { Statusdata, loading } = useSelector((state) => state.StatusData);
  var { message, agent, loading } = useSelector((state) => state.agent);
  const { hostings } = useSelector((state) => state?.licenceSlice);
  const { lostreason } = useSelector(
    (state) => state.lostreasonSlice.LostReasondata
  );
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [agents, setagent] = useState({});
  //const [status, setStatus] = useState({});
  const [lostreasonset, setlostreasonset] = useState({});
  const [none, setblock] = useState("contents");

  const submitleadsource = async (e) => {
    e.preventDefault();
    if (data._id) {
      const aaaaa = await dispatch(EditLeadSourceDetails(data));
      if (aaaaa.payload.success === true) {
        toast.success("Update Successfully");
      } else {
        toast.warn("There are some problem");
      }
    } else {
      const aaaa = await dispatch(addleadSource(data));
      if (aaaa.payload.success === true) {
        toast.success(aaaa.payload.message);
      } else {
        toast.warn(aaaa.payload.message);
      }
    }
  };

  const [formData, setFormData] = useState({
    _id: "",
    agent_name: "",
    agent_email: "",
    agent_mobile: "",
    client_access: "",
    agent_status: "",
  });

  const [formDatastatus, setformDatastatus] = useState({
    _id: "",
    status_name: "",
    status_name1: "",
  });
  const agentSubmit = async (e) => {
    e.preventDefault();
    const length = formData?.agent_mobile?.length;
   
    if (length < 10) {
      return toast.warn("PlZ Enter 10 Digit Contact No");
    }
    if (formData._id) {
      const aaaaa = await dispatch(EditAgentDetails(formData));
      if (aaaaa.payload.success === true) {
        setTimeout(() => {
      window.location.reload(false);
    }, 500);
        toast.success("Update Successfully");
      } else {
        toast.warn("There are some problem");
      }
    } else {
      const { _id, ...newAaa } = await formData;
      console.log('newAaa', newAaa);
      const aaaaa = await dispatch(addagent(newAaa));
      if (aaaaa.payload.success === true) {
        setTimeout(() => {
          window.location.reload(false);
        }, 500);
        toast.success("Agent add Successfully");
      } else {
        toast.warn("There are some problem");
      }
    }
    setFormData({
      _id: "",
      agent_name: "",
      agent_email: "",
      agent_mobile: "",
      client_access: "",
      agent_status: "",
    });
  };
  const [assigntlnone,setassigntlnone]=useState('none');
  const [assigntlnonetype,setassigntlnonetype]=useState('block');
  const UserType = async (e) => {
    setFormData({
      ...formData,
      role: e.target.value,
    })
    if(e.target.value==="user"){
      setassigntlnone('block')
    }
    if(e.target.value==="TeamLeader"){
      setassigntlnone('none')
    }
    }
  const editagent = async (_id,role) => {
    setblock("contents");
    const selectedData = await agent?.agent.find((item) => item._id === _id);
   
    setFormData(selectedData);
    if(role=='admin' || role=='TeamLeader'){
      setassigntlnone('none')
      setassigntlnonetype('none')
    }else{
      setassigntlnone('block')
      setassigntlnonetype('block')
    }
   
  };
  const editstatus = async (_id) => {
    const selectedData = await Statusdata?.leadstatus.find(
      (item) => item._id === _id
    );
    setformDatastatus(selectedData);
  };
  const editleadsource = async (_id) => {
    const selectedData = await leadSourcedata?.leadSource?.find(
      (item) => item._id === _id
    );
    setData(selectedData);
  };
  const editLeadReason = async (_id) => {
    const selectedData = await lostreason?.find((item) => item._id === _id);
    setlostreasonset(selectedData);
  };

  const submitStatus = async (e) => {
    e.preventDefault();
    if (formDatastatus._id) {
      const aaaa = await dispatch(EditStatusDetails(formDatastatus));
      if (aaaa.payload.success === true) {
        toast.success("Status Edit Successfully");
      } else {
        toast.warn("There are some problem");
      }
    } else {
      const { _id, ...newstaus } = await formDatastatus;
      const aaaa = await dispatch(addStatus(newstaus));
      console.log(aaaa);
      if (aaaa.payload.success === true) {
        toast.success("Status add Successfully");
      } else {
        toast.warn("There are some problem");
      }
    }

    setformDatastatus({
      _id: "",
      status_name: "",
      status_name1: "",
    });
  };

  const LostReasonSave = async (e) => {
    e.preventDefault();
    console.log('lostreasonset', lostreasonset)
    if (lostreasonset._id) {
      const aaaa = await dispatch(EditLostReason(lostreasonset));
      if (aaaa.payload.success === true) {
        toast.success("Lost Reason Update Successfully");
      } else {
        toast.warn("There are some problem");
      }
    } else {
      const aaaa = await dispatch(addLostReason(lostreasonset));
      if (aaaa.payload.success === true) {
        toast.success("Lost Reason add Successfully");
      } else {
        toast.warn("There are some problem");
      }
    }
  };

  const deleteLeadSource = async (_id) => {
    const aaaa = await dispatch(DeleteLeadSource(_id));
  };

  const setpayingcap = async () => {
    const agent_count = await agent?.agent?.length;
   
    // console.log(hostings["0"]?.Package);
    if (agent_count === hostings["0"]?.Package) {
      setblock("none");
    } else {
      setblock("contents");
    }
  };
  
  useEffect(() => {
    dispatch(getAllLeadSource());
    dispatch(getAllStatus());
    dispatch(getAllAgent());
    dispatch(getAllLostReason());
  }, []);

  useEffect(() => {
    setpayingcap();
  }, [agent?.agent?.length,hostings["0"]?.Package]);

  const handlesourceDelete = async (countryId) => {
    const confirmDelete1 = window.confirm(
      "Are you sure you want to delete this lead source?"
    );

    if (confirmDelete1) {
      try {
        // Assuming deleteLeadSource returns a promise (or is async)
        await dispatch(deleteLeadSource(countryId));
        toast.success("Delete Successfully");
      } catch (error) {
        toast.error("Delete Successfully");
        console.error("Error deleting lead source:", error);
      }
    } else {
      toast.success("Delete Canceled");
      console.log("Delete canceled");
    }
  };

  const datafomate = (date) => {
    const dateTime = new Date(date);
    const formattedDate = dateTime.toLocaleDateString();
    return `${formattedDate}`;
  };

  const datafomate1 = (date) => {
    const originalDate = new Date(date);
    originalDate.setFullYear(originalDate.getFullYear() + 1);
    return `${originalDate.toLocaleDateString()}`;
  };

  const Plan = (data) => {
    if (data == 10) {
      return `Basic`;
    }
    if (data == 30) {
      return `Premium`;
    }
    if (data == 50) {
      return `Silver`;
    }
    if (data == 500) {
      return `Gold`;
    }
  };
  const [companydetails, setcompanydetails] = useState({
    company_name: "",
    contact_person: "",
    company_email: "",
    company_mobile: "",
    website_name: "",
    company_pan: "",
    company_address: "",
    company_zip_code: "",
    company_city: "",
    company_state: "",
    company_country: "",
    company_gst: "",
  });
  const CompanyDetailSubmit = async (e) => {
    e.preventDefault();
    fetch(`${apiUrl}/CompanyDetails/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "mongodb-url": DBuUrl,
      },
      body: JSON.stringify(companydetails),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response?.status}`);
        }
        return response.json();
      })
      .then((data) => {
        toast.success(data?.message);
        console.log("Response from server:", data);
        setcompanydetails(data?.setting);
      })
      .catch((error) => {
        const message = error?.response?.data?.message;
        if (message == 'Client must be connected before running operations' || message == 'Internal Server Error') {
          CompanyDetailSubmit();
        }
        console.error("Fetch error:", error);
      });
  };

  const GetCompanyDetails = async () => {
    try {
      const responce = await axios.get(
        `${apiUrl}/GetCompanyDetails`, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
        },
      }
      );
      if (responce?.data?.success === true) {
        console.log(responce.data.setting?.["0"]);
        setcompanydetails(responce?.data?.setting?.["0"]);
      }
      if (responce?.data?.success === false) {
        const message = await responce?.data?.message;
        if (message == 'Client must be connected before running operations' || message == 'Internal Server Error') {
          GetCompanyDetails();
        }
        setcompanydetails(responce?.data?.setting);
      }
    } catch (error) {
      const message = error?.response?.data?.message;
      if (message == 'Client must be connected before running operations' || message == 'Internal Server Error') {
        GetCompanyDetails();
      }
    }
  };
  const [TeamLeader,setTeamLeader]=useState([]);
  const getTeamLeader=async ()=>{
    try {
      const responce = await axios.get(
        `${apiUrl}/getAllTeamLeader`, {
        headers: {
          "Content-Type": "application/json",
          "mongodb-url": DBuUrl,
        },
      }
      );
      setTeamLeader(responce?.data?.agent);
     } catch (error) {
     console.error(error)
    }
  }
  useEffect(() => {
    GetCompanyDetails();
    getTeamLeader();
  }, []);

  const handleContactNoChange = (e) => {
    const inputValue = e.target.value;
 const numericValue = inputValue.replace(/\D/g, "");
  const limitedValue = numericValue.slice(0, 10);
  setFormData({
    ...formData,
    agent_mobile:limitedValue,
  })
  };

  return (
    <div className="content-wrapper">
      {" "}
      {/* Main content */}
      <section className="content py-2 pt-3">
        <div className="container">
          <div className="row">
            <div className="col-12 pl-0">
              <div className="panel panel-bd lobidrag lobipanel">
                <div className="panel-heading">
                  <div className="btn-group">
                    <p>Settings</p>
                  </div>

                </div>
                <div className="container ind-module bg-white">
                  <div className="row mt-50">
                    <div className="col-12 col-sm-2 pl-0 mt-20">
                      <ul className="nav flex-column nav-tabs tabs-left border-lefttab destop-View">
                        <li>
                          <a
                            classname=""
                            id="v-pills-account-tab"
                            data-toggle="pill"
                            href="#v-pills-account"
                            role="tab"
                            aria-controls="v-pills-account"
                            aria-selected="true"
                          >
                            <i className="fa wiht fa-wrench" /> General Setting
                          </a>
                        </li>
                        {/* <li>
                      <a
                        id="v-pills-crm-tab"
                        data-toggle="pill"
                        href="#v-pills-crm"
                        role="tab"
                        aria-controls="v-pills-crm"
                        aria-selected="false"
                      >
                        <i className="fa wiht fa-assistive-listening-systems" />{" "}
                        System Setting
                      </a>
                    </li> */}
                        {/* <li>
                      <a
                        id="cronjob-tab"
                        data-toggle="pill"
                        href="#cronjob"
                        role="tab"
                        aria-controls="cronjob-inventory"
                        aria-selected="false"
                      >
                        <i className="fa wiht fa-wrench" /> Cron Jobs
                      </a>
                    </li> */}


                        {/* <li>
                          <a
                            id="v-pills-purchase-tab"
                            data-toggle="pill"
                            href="#v-pills-purchase"
                            role="tab"
                            aria-controls="v-pills-purchase"
                            aria-selected="false"
                          >
                            {" "}
                            <i className="fa wiht fa-cloud " /> Security Setting
                          </a>
                        </li> */}


                        {/* <li>
                      <a
                        id="v-pills-manufacturing-tab"
                        data-toggle="pill"
                        href="#v-pills-manufacturing"
                        role="tab"
                        aria-controls="v-pills-manufacturing"
                        aria-selected="false"
                      >
                        <i className="fa wiht fa-cog" /> Payment
                      </a>
                    </li> */}
                        {/* <li>
                      <a
                        id="v-pills-email-tab"
                        data-toggle="pill"
                        href="#v-pills-email"
                        role="tab"
                        aria-controls="v-pills-email"
                        aria-selected="false"
                      >
                        <i className="fa wiht fa-envelope" /> Email Setting
                      </a>
                    </li> */}
                        {/* <li>
                      <a
                        id="v-pills-smssetting-tab"
                        data-toggle="pill"
                        href="#v-pills-smssetting"
                        role="tab"
                        aria-controls="v-pills-smssetting"
                        aria-selected="false"
                      >
                        <i className="fa wiht fa-comments" /> SMS Setting
                      </a>
                    </li> */}
                        {/* <li> 
                  <a id="v-pills-invoicesetting-tab" data-toggle="pill" href="#v-pills-invoicesetting" role="tab" aria-controls="v-pills-invoicesetting" aria-selected="false"><i className="fa wiht fa-credit-card" /> Invoice Setting</a>
                  </li> */}
                        {/* <li>
                   <a id="email-template-tab" data-toggle="pill" href="#email-template-exim" role="tab" aria-controls="email-template-exim" aria-selected="false"><i className="fa wiht fa-globe" /> Email Templates</a>
                   </li> */}
                        <li>
                          <a  classname="active"
                            id="v-pills-department-tab"
                            data-toggle="pill"
                            href="#v-pills-department"
                            role="tab"
                            aria-controls="v-pills-department"
                            aria-selected="false"
                          >
                            <i className="fa wiht fa-users" /> Department
                          </a>
                        </li>
                        <li>
                          <a
                            id="v-pills-crm-filed-tab"
                            data-toggle="pill"
                            href="#v-pills-crm-filed"
                            role="tab"
                            aria-controls="v-pills-crm-filed"
                            aria-selected="false"
                          >
                            <i className="fa wiht fa-code" /> CRM Field
                          </a>
                        </li>
                        <li>
                          <a
                            id="v-pills-loginhistory-tab"
                            data-toggle="pill"
                            href="#subscription"
                            role="tab"
                            aria-controls="v-pills-loginHis"
                            aria-selected="false"
                          >
                            <i className="fa fa-sign" aria-hidden="true" />
                            Subscription
                          </a>
                        </li>
                        <li>
                          <a
                            id="v-pills-loginhistory-tab"
                            data-toggle="pill"
                            href="#v-pills-loginhistory"
                            role="tab"
                            aria-controls="v-pills-loginHis"
                            aria-selected="false"
                          >
                            <i className="fa fa-sign" aria-hidden="true" />
                            Login History
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="col-12 col-sm-10">
                      <div className="tab-content" id="v-pills-tabContent">
                        <div
                          className="tab-pane fade "
                          id="v-pills-account"
                          role="tabpanel"
                          aria-labelledby="v-pills-account-tab"
                        >
                          <form onSubmit={CompanyDetailSubmit}>
                            <div className="row">
                              <div className="col-sm-6 col-xs-12 pd-0t">
                                <div className="cardses">
                                  <div className="row pt-3">
                                    <div className="col-md-5 pd-top">
                                      <label>Company Name </label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          value={companydetails?.company_name}
                                          onChange={(e) =>
                                            setcompanydetails({
                                              ...companydetails,
                                              company_name: e.target.value,
                                            })
                                          }
                                          type="text"
                                          name="company_name"
                                          className="form-control"
                                          placeholder="Company Name"
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Contact Person</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          value={companydetails?.contact_person}
                                          onChange={(e) =>
                                            setcompanydetails({
                                              ...companydetails,
                                              contact_person: e.target.value,
                                            })
                                          }
                                          type="text"
                                          name="contact_person"
                                          className="form-control"
                                          placeholder="Contact Person"
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Email ID</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          value={companydetails?.company_email}
                                          onChange={(e) =>
                                            setcompanydetails({
                                              ...companydetails,
                                              company_email: e.target.value,
                                            })
                                          }
                                          name="company_email"
                                          className="form-control"
                                          placeholder="Email ID"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Contact No. </label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="number"
                                          value={companydetails?.company_mobile}
                                          onChange={(e) =>
                                            setcompanydetails({
                                              ...companydetails,
                                              company_mobile: e.target.value,
                                            })
                                          }
                                          name="company_mobile"
                                          className="form-control"
                                          placeholder="Contact No"
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Website Name</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          value={companydetails?.website_name}
                                          onChange={(e) =>
                                            setcompanydetails({
                                              ...companydetails,
                                              website_name: e.target.value,
                                            })
                                          }
                                          name="website_name"
                                          className="form-control"
                                          placeholder="Website Name"
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Company PAN No.</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          value={companydetails?.company_pan}
                                          onChange={(e) =>
                                            setcompanydetails({
                                              ...companydetails,
                                              company_pan: e.target.value,
                                            })
                                          }
                                          name="company_pan"
                                          className="form-control"
                                          placeholder="PAN Number"
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-6 col-xs-12 pd-0t">
                                <div className="cardses">
                                  <div className="row  pt-3">
                                    <div className="col-md-5 pd-top">
                                      <label>Company Address</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <textarea
                                          type="text"
                                          value={
                                            companydetails?.company_address
                                          }
                                          onChange={(e) =>
                                            setcompanydetails({
                                              ...companydetails,
                                              company_address: e.target.value,
                                            })
                                          }
                                          name="company_address"
                                          className="form-control"
                                          placeholder="Company Address"
                                          rows={1}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Pincode</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="company_zip_code"
                                          value={
                                            companydetails?.company_zip_code
                                          }
                                          onChange={(e) =>
                                            setcompanydetails({
                                              ...companydetails,
                                              company_zip_code: e.target.value,
                                            })
                                          }
                                          className="form-control"
                                          placeholder="Pincode"
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>City</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          value={companydetails?.company_city}
                                          onChange={(e) =>
                                            setcompanydetails({
                                              ...companydetails,
                                              company_city: e.target.value,
                                            })
                                          }
                                          name="company_city"
                                          className="form-control"
                                          placeholder="City"
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>State</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="company_state"
                                          value={companydetails?.company_state}
                                          onChange={(e) =>
                                            setcompanydetails({
                                              ...companydetails,
                                              company_state: e.target.value,
                                            })
                                          }
                                          className="form-control"
                                          placeholder="City"
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Country</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          value={
                                            companydetails?.company_country
                                          }
                                          onChange={(e) =>
                                            setcompanydetails({
                                              ...companydetails,
                                              company_country: e.target.value,
                                            })
                                          }
                                          name="company_country"
                                          className="form-control"
                                          placeholder="company_country"
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Company GST NO</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          value={companydetails?.company_gst}
                                          onChange={(e) =>
                                            setcompanydetails({
                                              ...companydetails,
                                              company_gst: e.target.value,
                                            })
                                          }
                                          name="company_gst"
                                          className="form-control"
                                          placeholder="Company GST NO"
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top"> </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="submit"
                                          name="submit"
                                          defaultValue="Submit"
                                          className="button-57"
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                        <div
                          className="tab-pane"
                          id="v-pills-crm"
                          role="tabpanel"
                          aria-labelledby="v-pills-crm-tab"
                        >
                          <form
                            action=" "
                            method="post"
                            name="system_setting"
                            id="system_setting"
                          >
                            <div className="row">
                              <div className="col-sm-6 col-xs-12 pd-0t">
                                <div className="cardses">
                                  <div className="row pt-3">
                                    <div className="col-md-5 pd-top">
                                      <label>Username</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="username"
                                          defaultValue="anurag"
                                          className="form-control"
                                          placeholder="Username"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>New Password</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="new_passwd"
                                          className="form-control"
                                          placeholder="New Password"
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Locale</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="locale"
                                          defaultValue="Delhi India"
                                          className="form-control"
                                          placeholder="Locale"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Default Currency</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="default_currency"
                                          className="form-control"
                                          defaultValue="Rs."
                                          placeholder="Default Currency"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Currency Position</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <select
                                          name="currency_position"
                                          className="form-control"
                                        >
                                          <option value>Select</option>
                                          <option value="before" selected>
                                            Before
                                          </option>
                                          <option value="after">After</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Currency Decimals </label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="currency_decimals"
                                          className="form-control"
                                          defaultValue={2}
                                          placeholder="Currency Decimals"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Task Notification</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <select
                                          name="task_what"
                                          className="form-control"
                                        >
                                          <option value>Select</option>
                                          <option value="email">Email</option>
                                          <option value="sms">SMS</option>
                                          <option value="email-sms" selected>
                                            Email and SMS
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Followup Notification</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <select
                                          name="followup_what"
                                          className="form-control"
                                        >
                                          <option value>Select</option>
                                          <option value="email">Email</option>
                                          <option value="sms" selected>
                                            SMS
                                          </option>
                                          <option value="email-sms">
                                            Email and SMS
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-6 col-xs-12">
                                <div className="cardses">
                                  <div className="row pt-4">
                                    <div className="col-md-5 pd-top">
                                      <label>Last Password</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="password"
                                          name="last_passwd"
                                          className="form-control"
                                          placeholder="Last Password"
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Purchase Code</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="purchase_code"
                                          className="form-control"
                                          defaultValue="HUUPBMBE4Q1B"
                                          placeholder="Purchase Code"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Tax</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="default_tax"
                                          className="form-control"
                                          defaultValue={18}
                                          placeholder="Tax"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Date Format</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <select
                                          className="form-control"
                                          name="date_format"
                                        >
                                          <option value>Select</option>
                                          <option value="d-m-Y" selected>
                                            dd-mm-YYYY
                                          </option>
                                          <option value="m-d-Y">
                                            mm-dd-YYYY
                                          </option>
                                          <option value="Y-m-d">
                                            YYYY-mm-dd
                                          </option>
                                          <option value="Y-d-m">
                                            YYYY-dd-mm
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>File Maximum Size (kb)</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="file_max_size"
                                          defaultValue={800000}
                                          placeholder=" File max size"
                                          required
                                          className="form-control"
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Task Notification Before</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="number"
                                          name="task_notified_minute"
                                          className="form-control"
                                          defaultValue={10}
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>
                                        Followup Notification Before
                                      </label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="number"
                                          name="followup_notified_minute"
                                          className="form-control"
                                          defaultValue={10}
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5" />
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="submit"
                                          name="submit"
                                          defaultValue="Submit"
                                          className="button-57 bg_colores "
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                        <div
                          className="tab-pane"
                          id="cronjob"
                          role="tabpanel"
                          aria-labelledby="cronjob-tab"
                        >
                          <div className="row">
                            <div
                              className="col-md-12"
                              style={{ padding: "20px 40px" }}
                            >
                              <div className="form-group">
                                {" "}
                                <b>Invoice Automate Cron Job</b>
                                <p>
                                  https://www.crm.bizavtar.com/cron/invoice_automate
                                </p>
                                <p>Last Run : 02-10-2023 10:30:02 AM</p>
                                <button
                                  id="inv_cron_run"
                                  className="btn btn-primary  "
                                >
                                  Run Manually
                                </button>
                              </div>
                              <div className="form-group">
                                {" "}
                                <b>Task Notification Cron Job</b>
                                <p>
                                  https://www.crm.bizavtar.com/cron/notify_task
                                </p>
                                <p>Last Run : 02-10-2023 11:27:01 PM</p>
                                <button
                                  id="task_cron_run"
                                  className="btn btn-primary  "
                                >
                                  Run Manually
                                </button>
                              </div>
                              <div className="form-group">
                                {" "}
                                <b>Followup Notification Cron Job</b>
                                <p>
                                  https://www.crm.bizavtar.com/cron/notify_followup
                                </p>
                                <p>Last Run : 02-10-2023 11:10:07 PM</p>
                                <button
                                  id="followup_cron_run"
                                  className="btn btn-primary  "
                                >
                                  Run Manually
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane"
                          id="v-pills-purchase"
                          role="tabpanel"
                          aria-labelledby="v-pills-purchase-tab"
                        >
                          <div className="row">
                            <div className="col-sm-7 col-xs-12 pd-0t">
                              <div className="cardses">
                                <div className="row mt-tp">
                                  <div className="col-md-4 pd-top">
                                    {/* <label>2 Step Verification</label> */}
                                  </div>
                                  <div className="col-md-1">
                                    <div className="form-group">
                                      <input
                                        type="checkbox"
                                        name="two_step_verification"
                                        className="form-controlcheck"
                                        defaultValue="yes"
                                        autoComplete="off"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-7 pd-top">
                                    <div className="row">
                                      {/* <div className="col-md-6 ">
                                        <div className="form-group">
                                          <button
                                            type="button"
                                            className="btn btn-sm btn-primary"
                                          >
                                            Export Database
                                          </button>
                                        </div>
                                      </div> */}
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                          >
                                            Logout All Devices
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <div className="col-sm-5 col-xs-12">
                              <div className="cardses">
                                <div className="row mt-tp">
                                  <div className="col-md-6 pd-top">
                                    <label>Login Notification</label>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="form-group">
                                      <input
                                        type="checkbox"
                                        name="login_notification"
                                        className="form-controlcheck"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="form-group">
                                      <button
                                        type="submit"
                                        name="submit"
                                        className="button-57 bg_colores "
                                      >
                                        Submit
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div> */}
                          </div>
                          <table
                            className="table-bordered table dataTable no-footer d-none"
                            role="grid"
                          >
                            <thead>
                              <tr role="row">
                                <th className="sorting_asc">Filename</th>
                                <th className="sorting">Action</th>
                              </tr>
                            </thead>
                            <tbody id="DBbfiles">
                              <tr role="row" className="odd">
                                <td className="sorting_1">
                                  dbbackup_22_Feb_2021_16_32_04.sql
                                </td>
                                <td>
                                  <a
                                    target="_blank"
                                    href
                                    className="btn btn-xs btn-success"
                                  >
                                    <i className="fa fa-download" />
                                  </a>
                                  <button
                                    type="button"
                                    className="btn btn-xs btn-success"
                                  >
                                    <i className="fa fa-upload" />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-xs btn-danger"
                                  >
                                    <i className="fa fa-trash" />
                                  </button>
                                </td>
                              </tr>
                              <tr role="row" className="even">
                                <td className="sorting_1">
                                  dbbackup_27_Jan_2021_11_05_52.sql
                                </td>
                                <td>
                                  <a
                                    target="_blank"
                                    href
                                    className="btn btn-xs btn-success"
                                  >
                                    <i className="fa fa-download" />
                                  </a>
                                  <button
                                    type="button"
                                    className="btn btn-xs btn-success"
                                  >
                                    <i className="fa fa-upload" />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-xs btn-danger"
                                  >
                                    <i className="fa fa-trash" />
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div
                          className="tab-pane"
                          id="v-pills-manufacturing"
                          role="tabpanel"
                          aria-labelledby="v-pills-manufacturing-tab"
                        >
                          <form
                            action=""
                            method="post"
                            name="payment_setting"
                            id="payment_setting"
                          >
                            <div className="address-sec">
                              <h4 style={{ display: "inline" }}>Razorpay - </h4>
                              <lable>Enable </lable>
                              <input
                                type="checkbox"
                                className="rozarpay"
                                name="is_razorpay"
                                defaultValue="yes"
                                autoComplete="off"
                              />
                            </div>
                            <div className="row">
                              <div className="col-sm-6 col-xs-12 ">
                                <div className="row">
                                  <div className="col-md-5 pd-top">
                                    <label>RAZOR_KEY_ID </label>
                                  </div>
                                  <div className="col-md-7">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        name="RAZOR_KEY_ID"
                                        defaultValue="rzptestz9f2em3bbJq6sE"
                                        className="form-control"
                                        autoComplete="off"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-5 pd-top">
                                    <label>Success Page </label>
                                  </div>
                                  <div className="col-md-7">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        name="razorpay_surl"
                                        defaultValue="httpswww.crm.bizavtar.com"
                                        className="form-control"
                                        autoComplete="off"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-6 col-xs-12">
                                <div className="row">
                                  <div className="col-md-5 pd-top">
                                    <label>RAZOR_KEY_SECRET</label>
                                  </div>
                                  <div className="col-md-7">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        name="RAZOR_KEY_SECRET"
                                        defaultValue="qGyIIe9u2Aclo9uevNrFXU8c"
                                        className="form-control"
                                        autoComplete="off"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-5 pd-top">
                                    <label>Failure Page </label>
                                  </div>
                                  <div className="col-md-7">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        name="razorpay_furl"
                                        defaultValue="httpswww.crm.bizavtar.com"
                                        className="form-control"
                                        autoComplete="off"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 address-sec">
                              <h4 style={{ display: "inline" }}>
                                PayU Money -{" "}
                              </h4>{" "}
                              &nbsp;&nbsp;
                              <lable> Enable </lable>
                              <input
                                type="checkbox"
                                className="rozarpay"
                                name="is_payu"
                                defaultValue="yes"
                                autoComplete="off"
                              />
                            </div>
                            <div className="row">
                              <div className="col-sm-6 col-xs-12">
                                <div className="row">
                                  <div className="col-md-5 pd-top">
                                    <label>KEY_ID </label>
                                  </div>
                                  <div className="col-md-7">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        name="PAYU_KEY_ID"
                                        defaultValue="cUQpmWIY"
                                        className="form-control"
                                        autoComplete="off"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-5 pd-top">
                                    <label>Success Page </label>
                                  </div>
                                  <div className="col-md-7">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        name="payu_surl"
                                        defaultValue="httpswww.crm.bizavtar.com"
                                        className="form-control"
                                        autoComplete="off"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-6 col-xs-12">
                                <div className="row">
                                  <div className="col-md-5 pd-top">
                                    <label>SALT_KEY</label>
                                  </div>
                                  <div className="col-md-7">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        name="PAYU_SALT_KEY"
                                        defaultValue="UjYwHYFgcd"
                                        className="form-control"
                                        autoComplete="off"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-5 pd-top">
                                    <label>Failure Page </label>
                                  </div>
                                  <div className="col-md-7">
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        name="payu_furl"
                                        defaultValue="httpswww.crm.bizavtar.com"
                                        className="form-control"
                                        autoComplete="off"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-3 pd-top">
                                <label htmlFor="is_bank_details">
                                  Bank Details{" "}
                                  <input
                                    id="is_bank_details"
                                    type="checkbox"
                                    name="is_bank_details"
                                    defaultValue="yes"
                                    autoComplete="off"
                                  />
                                </label>
                              </div>
                              <div className="col-md-9">
                                <div className="form-group">
                                  <textarea
                                    name="bank_details"
                                    className="form-control"
                                    defaultValue={""}
                                  />
                                </div>
                              </div>
                              <div className="col-md-10" />
                              <div className="col-md-2">
                                <div className="form-group">
                                  <button
                                    type="submit"
                                    name="submit"
                                    className="btn btn-success btn-block"
                                  >
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                        <div
                          className="tab-pane"
                          id="v-pills-email"
                          role="tabpanel"
                          aria-labelledby="v-pills-email-tab"
                        >
                          <form
                            action=""
                            method="post"
                            name="email_setting"
                            id="email_setting"
                          >
                            <div className="row pt-3">
                              <div className="col-sm-6 col-xs-12 pd-0t">
                                <div className="cardsess-setting">
                                  <div className="row">
                                    <div className="col-md-5 pd-top">
                                      <label>Company Email</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="support_email"
                                          className="form-control"
                                          defaultValue="info@bizavtar.com"
                                          placeholder="Company Email"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>SMTP Port</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="smtp_port"
                                          className="form-control"
                                          defaultValue={587}
                                          placeholder="SMTP Port"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>SMTP Host</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="smtp_host"
                                          className="form-control"
                                          defaultValue="mail.themenick.in"
                                          placeholder="SMTP Host"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-6 col-xs-12">
                                <div className="cardses">
                                  <div className="row">
                                    <div className="col-md-5 pd-top">
                                      <label>Mail Type</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <select
                                          name="mail_type"
                                          className="form-control"
                                        >
                                          <option value="php" selected>
                                            PHP
                                          </option>
                                          <option value="smtp">SMTP</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>SMTP Username</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="smtp_user"
                                          className="form-control"
                                          defaultValue="info@bizavtar.com"
                                          placeholder="SMTP Username"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>SMTP Password</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="smtp_pass"
                                          className="form-control"
                                          defaultValue="developer1111####"
                                          placeholder="SMTP Password"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top"></div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="submit"
                                          name="submit"
                                          defaultValue="Submit"
                                          className="button-57 bg_colores "
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                          <form name="test-smtp" id="test-smtp">
                            <div className="row">
                              <div className="col-md-8 col-xs-12">
                                <div className="cardses">
                                  <div className="card-headers">
                                    <div className="row">
                                      <div className="col-md-3 pd-top">
                                        Test SMTP
                                      </div>
                                      <div className="col-md-9">
                                        <div className="form-group">
                                          <input
                                            type="email"
                                            placeholder="Email"
                                            className="form-control"
                                            name="email"
                                            id="text"
                                            autoComplete="off"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4 col-xs-12">
                                <div className="cardses">
                                  <div className="card-headers">
                                    <div className="form-group">
                                      <button
                                        type="submit"
                                        className="btn btn-primary setting form-control"
                                      >
                                        Send
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                        <div
                          className="tab-pane"
                          id="v-pills-smssetting"
                          role="tabpanel"
                          aria-labelledby="v-pills-smssetting-tab"
                        >
                          <form
                            action
                            method="post"
                            name="sms_setting"
                            id="sms_setting"
                          >
                            <div class="row">
                              <div className="col-sm-6 col-xs-12 pd-0t">
                                <div className="cardses">
                                  <div className="row">
                                    <div className="col-md-5 pd-top">
                                      <label>SMS Host URL</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="sms_host"
                                          className="form-control"
                                          defaultValue="http://sms.itinfoclub.com/api/pushsms.php"
                                          placeholder="SMS Host URL"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>SMS User ID</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="sms_user_id"
                                          className="form-control"
                                          defaultValue="ITINFO"
                                          placeholder="SMS User ID"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>SMS API Key</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="sms_api_key"
                                          className="form-control"
                                          defaultValue="K-LthcyfB9goMg2fgv27pqIQ0LFlc14ICG7tfP4ZWLSV5so6Wa8tyb15bHhgqC27"
                                          placeholder="SMS API Key"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-6 col-xs-12">
                                <div className="cardses">
                                  <div className="row">
                                    <div className="col-md-5 pd-top">
                                      <label>SMS Balance</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div
                                        className="form-group"
                                        style={{ fontSize: "1.8rem" }}
                                      >
                                        4204{" "}
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>SMS Username</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="sms_user"
                                          className="form-control"
                                          defaultValue="anuragk"
                                          placeholder="SMS Username"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>SMS Password</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="sms_pass"
                                          className="form-control"
                                          placeholder="SMS Password"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top" />
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <button
                                          type="submit"
                                          name="submit"
                                          defaultValue="Submit"
                                          className="button-57"
                                        >
                                          Submit
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                        <div
                          className="tab-pane"
                          id="v-pills-invoicesetting"
                          role="tabpanel"
                          aria-labelledby="v-pills-invoicesetting-tab"
                        >
                          <form
                            action=" "
                            method="post"
                            name="invoice_setting"
                            encType="multipart/form-data"
                          >
                            <div className="row">
                              <div className="col-sm-6 col-xs-12 pd-0t">
                                <div className="cardses">
                                  <div className="row">
                                    <div className="col-md-5 pd-top">
                                      <label>Invoice Prefix</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="invoice_prefix"
                                          defaultValue
                                          className="form-control"
                                          placeholder="Invoice Prefix"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Invoice due before</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          className="form-control"
                                          name="invoices_due_before"
                                          placeholder="4 days"
                                          defaultValue={15}
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Invoices Due After</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="invoices_due_after"
                                          defaultValue={2}
                                          className="form-control"
                                          placeholder="5 days"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Invoice Starting Number </label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          name="invoice_start_no"
                                          defaultValue
                                          className="form-control"
                                          placeholder={1001}
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-6 col-xs-12">
                                <div className="cardses">
                                  <div className="row">
                                    <div className="card-headers">
                                      <div className="image-input image-input-outline">
                                        <div className="image-input-wrapper">
                                          <img
                                            src="https://www.crm.bizavtar.com/resource/system_uploads/inv_logo/magic-logo.png"
                                            alt="invlogo"
                                            style={{
                                              height: 120,
                                              width: 100,
                                              objectFit: "contain",
                                            }}
                                            id="invlogo"
                                          />
                                        </div>
                                        <label
                                          className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                                          data-action="change"
                                          data-toggle="tooltip"
                                          title
                                          data-original-title="Change Logo"
                                        >
                                          <i className="fa fa-edit icon-sm text-muted" />
                                          <input
                                            type="file"
                                            name="invoice_logo"
                                            id="invoice_logo"
                                            accept=".png, .jpg, .jpeg"
                                            autoComplete="off"
                                          />
                                          <input
                                            type="hidden"
                                            name="prev_logo"
                                            defaultValue="logo-main.png"
                                            autoComplete="off"
                                          />
                                          <input
                                            type="hidden"
                                            name="is_remove"
                                            id="is_remove"
                                            defaultValue="false"
                                            autoComplete="off"
                                          />
                                        </label>
                                        <span
                                          className="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                                          id="remove_logo"
                                          data-action="remove"
                                          data-toggle="tooltip"
                                          title
                                          data-original-title="Remove Logo"
                                        >
                                          <i className="fa fa-trash icon-xs text-muted" />
                                        </span>
                                      </div>
                                      <span className="form-text text-muted">
                                        Allowed file types: png, jpg, jpeg.
                                      </span>
                                      <br />
                                      <span
                                        className="text-danger"
                                        id="logoError"
                                      />
                                      <div className="col-md-8 pd-top"> </div>
                                      <div className="col-md-4">
                                        <div className="form-group">
                                          <input
                                            type="submit"
                                            name="submit"
                                            defaultValue="Submit"
                                            className="button-57 bg_colores "
                                            autoComplete="off"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                        <div
                          className="tab-pane"
                          id="email-template-exim"
                          role="tabpanel"
                          aria-labelledby="v-pills-purchase-tab"
                        >
                          <div className="card">
                            <div className="card-header text-center">
                              <span>
                                Use variables to call dynamic data. For user
                                details - For date - For payment method For
                                invoice number For amount payable For due date
                                and For invoice items call{" "}
                              </span>
                            </div>
                            <div className="card-body">
                              <div className="flex flex-column mb-5 mt-4 faq-section">
                                <div className="row">
                                  <div className="col-md-12">
                                    <div id="accordion">
                                      <div className="card">
                                        <div
                                          className="card-header"
                                          id="heading-1"
                                        >
                                          <h5 className="mb-0">
                                            <a
                                              role="button"
                                              data-toggle="collapse"
                                              href="#collapse-1"
                                              aria-expanded="true"
                                              aria-controls="collapse-1"
                                            >
                                              Invoice Email
                                            </a>
                                          </h5>
                                        </div>
                                        <div
                                          id="collapse-1"
                                          className="collapse"
                                          data-parent="#accordion"
                                          aria-labelledby="heading-1"
                                        >
                                          <div className="card-body">
                                            FXCOPIER is the worlds most reliable
                                            remote trade copier. Its allow you
                                            to copy trades almost instantly
                                            between hundreds of MT4 accounts
                                            through the use of technology. Many
                                            of the industries leading money
                                            managers use FXCopier to easily
                                            manage multiple client accounts in
                                            tandem.
                                          </div>
                                        </div>
                                      </div>
                                      <div className="card">
                                        <div
                                          className="card-header"
                                          id="heading-2"
                                        >
                                          <h5 className="mb-0">
                                            <a
                                              className="collapsed"
                                              role="button"
                                              data-toggle="collapse"
                                              href="#collapse-2"
                                              aria-expanded="false"
                                              aria-controls="collapse-2"
                                            >
                                              Overdue Email
                                            </a>
                                          </h5>
                                        </div>
                                        <div
                                          id="collapse-2"
                                          className="collapse"
                                          data-parent="#accordion"
                                          aria-labelledby="heading-2"
                                        >
                                          <div className="card-body">
                                            After subscription you will get our
                                            special trade copier. If you want to
                                            use this copier for business purpose
                                            or other commercial pupose then
                                            directly contact with
                                            www.fxcopier.co.uk.
                                          </div>
                                        </div>
                                      </div>
                                      <div className="card">
                                        <div
                                          className="card-header"
                                          id="heading-3"
                                        >
                                          <h5 className="mb-0">
                                            <a
                                              className="collapsed"
                                              role="button"
                                              data-toggle="collapse"
                                              href="#collapse-3"
                                              aria-expanded="false"
                                              aria-controls="collapse-3"
                                            >
                                              Invoice conformation
                                            </a>
                                          </h5>
                                        </div>
                                        <div
                                          id="collapse-3"
                                          className="collapse"
                                          data-parent="#accordion"
                                          aria-labelledby="heading-3"
                                        >
                                          <div className="card-body">
                                            After subscription you will get our
                                            special trade copier. If you want to
                                            use this copier for business purpose
                                            or other commercial pupose then
                                            directly contact with
                                            www.fxcopier.co.uk.
                                          </div>
                                        </div>
                                      </div>
                                      <div className="card">
                                        <div
                                          className="card-header"
                                          id="heading-4"
                                        >
                                          <h5 className="mb-0">
                                            <a
                                              className="collapsed"
                                              role="button"
                                              data-toggle="collapse"
                                              href="#collapse-4"
                                              aria-expanded="false"
                                              aria-controls="collapse-4"
                                            >
                                              Wrong Data Alert
                                            </a>
                                          </h5>
                                        </div>
                                        <div
                                          id="collapse-4"
                                          className="collapse"
                                          data-parent="#accordion"
                                          aria-labelledby="heading-4"
                                        >
                                          <div className="card-body">
                                            After subscription you will get our
                                            special trade copier. If you want to
                                            use this copier for business purpose
                                            or other commercial pupose then
                                            directly contact with
                                            www.fxcopier.co.uk.
                                          </div>
                                        </div>
                                      </div>
                                      <div className="card">
                                        <div
                                          className="card-header"
                                          id="heading-5"
                                        >
                                          <h5 className="mb-0">
                                            <a
                                              className="collapsed"
                                              role="button"
                                              data-toggle="collapse"
                                              href="#collapse-5"
                                              aria-expanded="false"
                                              aria-controls="collapse-5"
                                            >
                                              Testing Template 2
                                            </a>
                                          </h5>
                                        </div>
                                        <div
                                          id="collapse-5"
                                          className="collapse"
                                          data-parent="#accordion"
                                          aria-labelledby="heading-5"
                                        >
                                          <div className="card-body">
                                            After subscription you will get our
                                            special trade copier. If you want to
                                            use this copier for business purpose
                                            or other commercial pupose then
                                            directly contact with
                                            www.fxcopier.co.uk.
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-md-9" />
                                        <div className="col-md-3">
                                          <div className="form-group">
                                            <button
                                              type="button"
                                              className="btn btn-sm btn-primary form-control"
                                              id="addnewetemp"
                                              style={{ float: "right" }}
                                            >
                                              Add New
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className="tab-pane show active"
                          id="v-pills-department"
                          role="tabpanel"
                          aria-labelledby="v-pills-department-tab"
                        >

                          <form onSubmit={agentSubmit}>
                            <div className="col-sm-12 col-xs-12 pt-3">
                              <div className="service-con">
                                <div className="cards">
                                  <div className="row">
                                    <div
                                      className="col-sm-12 col-xs-12 pt-3"
                                      style={{ display: none }}
                                    >
                                      <div className="col-md-3">
                                        <div className="form-group">
                                          <input
                                            value={formData?.agent_name}
                                            type="text"
                                            onChange={(e) =>
                                              setFormData({
                                                ...formData,
                                                agent_name: e.target.value,
                                              })
                                            }
                                            className="form-control"
                                            name="agent_name"
                                            placeholder="User Name"
                                            required
                                            id="aname"
                                            autoComplete="off"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="form-group">
                                          <input
                                            type="email"
                                            value={formData?.agent_email}
                                            className="form-control"
                                            onChange={(e) =>
                                              setFormData({
                                                ...formData,
                                                agent_email: e.target.value,
                                              })
                                            }
                                            name="agent_email"
                                            placeholder="Email"
                                            required
                                            id="aemail"
                                            autoComplete="off"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="form-group">
                                          <input
                                            type="number"
                                            value={formData?.agent_mobile}
                                            maxLength={10}
                                            className="form-control"
                                            onChange={handleContactNoChange}
                                            // onChange={(e) =>
                                            //   setFormData({ 
                                            //     ...formData,
                                            //     agent_mobile: e.target.value,
                                            //   })
                                            // }
                                            name="agent_mobile"
                                            placeholder="Mobile"
                                            required
                                            id="amobile"
                                            autoComplete="off"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="form-group">
                                          <input
                                            type="password"
                                            className="form-control"
                                            name="agent_password"
                                            value={formData?.agent_password}
                                            onChange={(e) =>
                                              setFormData({
                                                ...formData,
                                                agent_password: e.target.value,
                                              })
                                            }
                                            placeholder="Password"
                                            id="apassword"
                                            autoComplete="off"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-3" >
                                        <div className="form-group">
                                          <select
                                            value={formData?.agent_status}
                                            className="form-control"
                                            onChange={(e) =>
                                              setFormData({
                                                ...formData,
                                                agent_status: e.target.value,
                                              })
                                            }
                                            name="agent_status"
                                            id="aroll"
                                          >
                                            <option value>Status</option>
                                            <option value="1">Enable</option>
                                            <option value="0">Disable</option>
                                          </select>
                                        </div>
                                      </div>

                                      <div className="col-md-3" style={{display:assigntlnonetype}}>
                                        <div className="form-group">
                                          <select
                                            value={formData?.role}
                                            className="form-control"
                                              onChange={UserType}
                                            name="role"
                                            id="aroll"
                                          >
                                            <option value>User Type</option>
                                            <option value="user">Agent</option>
                                            <option value="TeamLeader">Team Leader</option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="col-md-3" style={{display:assigntlnone}}>
                                        <div className="form-group">
                                          <select
                                            value={formData?.assigntl}
                                            className="form-control"
                                            onChange={(e) =>
                                              setFormData({
                                                ...formData,
                                                assigntl: e.target.value,
                                              })
                                            }
                                            name="assigntl"
                                            id="aroll"
                                          >

                                            <option value>Assign Team Leader</option>
                                            {TeamLeader?.map((TeamLeader1)=>{  
                                              return(<option value={TeamLeader1?._id}>{TeamLeader1?.agent_name}</option>);
                                            })}
                                            
                                          </select>
                                        </div>
                                      </div>

                                      {/* <div className="col-md-3">
                                        <div className="form-group">
                                          <select
                                            className="form-control"
                                            value={formData.client_access}
                                            onChange={(e) =>
                                              setFormData({
                                                ...formData,
                                                client_access: e.target.value,
                                              })
                                            }
                                            name="client_access"
                                            id="afeature"
                                          >
                                            <option value>
                                              Feature Action
                                            </option>
                                            <option value="yes">
                                              Client Access
                                            </option>
                                          </select>
                                        </div>
                                      </div> */}
                                      <div className="col-md-2">
                                        <div className="form-group">
                                          <button
                                            className="button-57"
                                            type="post"
                                            id="aaction"
                                          >
                                            {formData._id ? "Edit" : "Add"}
                                          </button>

                                          <button
                                            type="button"
                                            className="btn btn-danger"
                                            id="acancel"
                                            style={{ display: "none" }}
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                      <div className="col-md-3">
                                        <div className="form-group" style={{ marginTop: '10px' }}>
                                          {  }
                                          <b >Remaining User Count :</b> <b>{hostings["0"]?.Package - agent?.agent?.length}</b>
                                        </div>
                                      </div>
                                    </div>
                                  </div>   



                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="table-responsive mob-bord">
                                        <table
                                          className="table-bordered table dataTable no-footer"
                                          role="grid"
                                        >
                                          <thead>
                                            <tr role="row">
                                              <th className="sorting_asc">
                                                S.No.
                                              </th>
                                              <th className="sorting_asc">
                                                User Name
                                              </th>
                                              <th className="sorting">Email</th>
                                              <th className="sorting">
                                                Mobile
                                              </th>
                                              <th className="sorting">Roll</th>
                                              <th className="sorting">
                                               Assign TeamLeader
                                              </th>
                                             
                                               <th className="sorting">
                                                Action
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody id="DBbfiles">
                                            {agent?.agent?.map(
                                              (agents, key) => {
                                                if (
                                                  agents.agent_status == "0"
                                                ) {
                                                  var lllll = "Disable";
                                                } else {
                                                  lllll = "Enable";
                                                }

                                                if (
                                                  agents.client_access == "no"
                                                ) {
                                                  var client_access1 = "";
                                                } else {
                                                  var client_access1 =
                                                    "checked";
                                                }

                                                return (
                                                  <tr
                                                    role="row"
                                                    className="odd"
                                                  >
                                                    <td className="sorting_1">
                                                      {" "}
                                                      {key + 1}
                                                    </td>
                                                    <td className="sorting_1">
                                                      {" "}
                                                      {agents?.agent_name}
                                                    </td>
                                                    <td className="sorting_1">
                                                      {" "}
                                                      {agents?.agent_email}
                                                    </td>
                                                    <td className="sorting_1">
                                                      {" "}
                                                      {agents.agent_mobile}
                                                    </td>
                                                    <td className="sorting_1">
                                                      {" "}
                                                      {agents.role}
                                                    </td>

                                                    <td className="sorting_1">
                                                       {agents?.agent_details[0]?.agent_name}
                                                    </td>
                                                    {/* <td className="sorting_1">
                                                      Client Access
                                                      <input
                                                        checked={client_access1}
                                                        type="checkbox"
                                                        id=""
                                                        data-id="MjQ="
                                                      ></input>
                                                    </td> */}
                                                    {/* <td className="sorting_1">
                                                      {lllll}
                                                    </td> */}
                                                    
                                                    <td>
                                                      <button
                                                        type="button"
                                                        className="btn btn-danger btn-xl mr-2"
                                                        onClick={(e) =>
                                                          removeSite(agents._id)
                                                        }
                                                      >
                                                        <i
                                                          class="fa fa-trash"
                                                          aria-hidden="true"
                                                        ></i>
                                                      </button>
                                                      {/* <button type="button" class="btn btn-danger btn-xl mr-2" data-toggle="modal" data-target="#exampleModal">
                                                        <i
                                                          class="fa fa-trash"
                                                          aria-hidden="true"
                                                        ></i>
                                                      </button> */}


                                                      <button
                                                        type="button"
                                                        className="btn btn-success btn-x"
                                                        onClick={(e) =>
                                                          editagent(agents?._id,agents?.role)
                                                        }
                                                      >
                                                        <i
                                                          class="fa fa-pencil-square"
                                                          aria-hidden="true"
                                                        ></i>
                                                      </button>
                                                    </td>
                                                  </tr>
                                                );
                                              }
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                          {/* modal */}
                          <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <h5 class="modal-title" id="exampleModalLabel">Transfer Your All Lead To Other Agent</h5>
                                  <button type="button" class="close" onClick={() => {
                                    window.$('#exampleModal').modal('hide');
                                  }}
                                    data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                                <div class="modal-body">
                                  <form onSubmit={LeadTransfer}>
                                    <div className="row">

                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <select
                                            className="form-control"
                                            onChange={(e) =>
                                              setIdToDelete1({
                                                ...idToDelete1,
                                                agent_id: e.target.value,
                                              })
                                            }
                                            name="agent_id"
                                            id="aroll"
                                          >
                                            <option value>Select Agent</option>
                                            {agent?.agent?.map(
                                              (agents, key) => {
                                                if (agents?._id == idToDelete) {
                                                } else {
                                                  return (<option value={agents?._id}>{agents?.agent_name}</option>);
                                                }
                                              })}
                                          </select>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <button type="submit" class="btn btn-primary">Transfer</button>
                                        </div>
                                      </div>

                                    </div>
                                  </form>
                                </div>

                              </div>
                            </div>
                          </div>
                          {/* modal */}
                        </div>
                        <div
                          className="tab-pane"
                          id="v-pills-crm-filed"
                          role="tabpanel"
                          aria-labelledby="v-pills-crm-filed"
                        >
                          <div className="row">
                            <div className="col-12 col-xl-9 col-lg-9 col-md-9">
                              <ul className="nav nav-tabs">
                                <li className="active" data-active="#Option">
                                  {/* <a data-toggle="tab" href="#home">
                                Option
                              </a> */}
                                </li>
                                {/* <li data-active="#custome-field"><a data-toggle="tab" href="#custome-field">Custom Field</a></li> */}
                              </ul>
                            </div>
                            {/* <div className="col-12 col-xl-3 col-lg-3 col-md-3">
                          <div className="custome_new">
                            <a
                              href="javascript:;"
                              className
                              data-toggle="modal"
                              data-target="#custome"
                            >
                              Add New Custom
                            </a>
                          </div>
                        </div> */}
                          </div>
                          <div className="tab-content">
                            <div id="Option" className="tab-pane  in active">
                              <div className="panel panel-bd">
                                <div className="panel panel-bd ">
                                  <div className="panel-heading lead_source">
                                    <div className="btn-group">
                                      {" "}
                                      Lead Source
                                    </div>
                                  </div>
                                </div>
                                <div className="panel-body">
                                  <div className="cards">
                                    <form onSubmit={submitleadsource}>
                                      <div className="row">
                                        <div className="col-md-8">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              name="lead_source_name"
                                              required
                                              value={data.lead_source_name}
                                              onChange={(e) =>
                                                setData({
                                                  ...data,
                                                  lead_source_name:
                                                    e.target.value,
                                                })
                                              }
                                              className="form-control"
                                              placeholder="Lead Source"
                                              autoComplete="off"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="resets-button">
                                            <button
                                              type="submit"
                                              className="button-57"
                                            >
                                              {data._id ? "Edit" : "Submit"}
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </form>
                                    <div className="table-responsive">
                                      <form
                                        name="leadsort"
                                        id="leadsort"
                                        method="post"
                                      >
                                        <input
                                          type="hidden"
                                          name="name"
                                          defaultValue="lead_source"
                                          autoComplete="off"
                                        />
                                        <table
                                          className="table table-bordered table-hover"
                                          id="lstable"
                                        >
                                          <thead>
                                            <tr>
                                              <th>S.N.</th>
                                              <th>Lead Source Name</th>
                                              <th>Action</th>
                                            </tr>
                                          </thead>
                                          <tbody id="lead_source_list">
                                            {leadSourcedata?.leadSource?.map(
                                              (country1, index) => {
                                                var sr = index + 1;
                                                return (
                                                  <tr data-fire="lMTU=">
                                                    <td>
                                                      <span data-take="lMTU=">
                                                        {sr}
                                                      </span>
                                                    </td>
                                                    <td>
                                                      <span data-take="lMTU=">
                                                        {
                                                          country1.lead_source_name
                                                        }
                                                      </span>
                                                    </td>
                                                    <td>
                                                      {/* <button
                                                    type="button"
                                                    onClick={handlesourceDelete}
                                                    // onClick={(e) => {
                                                    //   deleteLeadSource(
                                                    //     country1._id
                                                    //   );
                                                    // }}
                                                    
                                                    className="btn btn-danger btn-xs"
                                                  > <i className="fa fa-trash" />
                                                  </button> */}
                                                      <button
                                                        type="button"
                                                        onClick={() =>
                                                          handlesourceDelete(
                                                            country1?._id
                                                          )
                                                        }
                                                        className="btn btn-danger btn-xs"
                                                      >
                                                        <i className="fa fa-trash" />
                                                      </button>
                                                      <button
                                                        type="button"
                                                        onClick={(e) =>
                                                          editleadsource(
                                                            country1._id
                                                          )
                                                        }
                                                        className="btn btn-info btn-xs"
                                                      >
                                                        <i
                                                          className="fa fa-pencil-square-o"
                                                          aria-hidden="true"
                                                        ></i>
                                                      </button>
                                                    </td>
                                                  </tr>
                                                );
                                              }
                                            )}
                                          </tbody>
                                        </table>
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="panel panel-bd">
                                <div className="panel panel-bd ">
                                  <div className="panel-heading lead_source">
                                    <div className="btn-group"> Status</div>
                                  </div>
                                </div>
                                <div className="panel-body">
                                  <div className="cards">
                                    <form onSubmit={submitStatus}>
                                      <div className="row">
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              value={
                                                formDatastatus?.status_name
                                              }
                                              name="status_name"
                                              id="lead_source"
                                              required
                                              onChange={(e) =>
                                                setformDatastatus({
                                                  ...formDatastatus,
                                                  status_name: e.target.value,
                                                })
                                              }
                                              className="form-control"
                                              placeholder="Status"
                                              autoComplete="off"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              value={
                                                formDatastatus?.status_name1
                                              }
                                              name="status_name1"
                                              id="lead_source"
                                              onChange={(e) =>
                                                setformDatastatus({
                                                  ...formDatastatus,
                                                  status_name1: e.target.value,
                                                })
                                              }
                                              className="form-control"
                                              placeholder="Dispalay Status"
                                              autoComplete="off"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="resets-button">
                                            <button
                                              type="submit"
                                              name="submit"
                                              className="button-57 bg_colores "
                                            >
                                              {formDatastatus._id
                                                ? "Edit"
                                                : "Add"}
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </form>
                                    <div className="table-responsive">
                                      <form
                                        name="leadsort"
                                        id="leadsort"
                                        method="post"
                                      >
                                        <input
                                          type="hidden"
                                          name="name"
                                          defaultValue="lead_source"
                                          autoComplete="off"
                                        />

                                        <table
                                          className="table table-bordered table-hover"
                                          id="lstable"
                                        >
                                          <thead>
                                            <tr>
                                              <th>S.N.</th>
                                              <th>Status Name</th>
                                              <th>Display Status Name</th>
                                              <th> Action</th>
                                            </tr>
                                          </thead>
                                          <tbody id="lead_source_list">
                                            {Statusdata?.leadstatus?.map(
                                              (state, key) => {
                                                const getStatusBadgeClass = (
                                                  statusName
                                                ) => {
                                                  switch (statusName) {
                                                    case "65a904164473619190494480": {
                                                      return "d-none";
                                                    }
                                                    case "65a903f8447361919049447c": {
                                                      return "d-none";
                                                    }
                                                    case "65a903ca4473619190494478": {
                                                      return "d-none";
                                                    }
                                                    case "65a903e9447361919049447a": {
                                                      return "d-none";
                                                    }
                                                    case "65a904ed4473619190494484": {
                                                      return "d-none";
                                                    }
                                                    case "65a904e04473619190494482": {
                                                      return "d-none";
                                                    }

                                                    default:
                                                      return ""; // Default class for other statuses
                                                  }
                                                };

                                                const handleStatusDelete =
                                                  () => {
                                                    const confirmDelete =
                                                      window.confirm(
                                                        "Are you sure you want to delete this lead Status?"
                                                      );

                                                    if (confirmDelete) {
                                                      // Dispatch the deleteProductService action with the product/service ID
                                                      dispatch(
                                                        deleteStatus(state._id)
                                                      );
                                                      toast.success(
                                                        "Delete Successfully"
                                                      );
                                                    } else {
                                                      toast.success(
                                                        "Delete Canceled"
                                                      );
                                                      console.log(
                                                        "Delete canceled"
                                                      );
                                                    }
                                                  };

                                                return (
                                                  <tr data-fire="lMTU=">
                                                    <td>
                                                      <span data-take="lMTU=">
                                                        {key + 1}
                                                      </span>
                                                    </td>
                                                    <td>
                                                      <span data-take="lMTU=">
                                                        {state.status_name}
                                                      </span>
                                                    </td>
                                                    <td>
                                                      <span data-take="lMTU=">
                                                        {state.status_name1}
                                                      </span>
                                                    </td>
                                                    <td>
                                                      <button
                                                        type="button"
                                                        onClick={(e) =>
                                                          editstatus(state._id)
                                                        }
                                                        className="btn btn-info btn-xs"
                                                      >
                                                        <i
                                                          className="fa fa-pencil-square-o"
                                                          aria-hidden="true"
                                                        ></i>
                                                      </button>
                                                      <button
                                                        type="button"
                                                        onClick={
                                                          handleStatusDelete
                                                        }
                                                        className={`btn btn-danger btn-xs ${getStatusBadgeClass(
                                                          state._id
                                                        )}`}
                                                      >
                                                        <i className="fa fa-trash" />
                                                      </button>
                                                    </td>
                                                  </tr>
                                                );
                                              }
                                            )}
                                          </tbody>
                                        </table>
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="panel panel-bd">
                                <div className="panel panel-bd ">
                                  <div className="panel-heading lead_source">
                                    <div className="btn-group">Lost Reason</div>
                                  </div>
                                </div>
                                <div className="panel-body">
                                  <div className="cards">
                                    <form onSubmit={LostReasonSave}>
                                      <div className="row">
                                        <div className="col-md-8">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              value={
                                                lostreasonset?.lost_reason_name
                                              }
                                              onChange={(e) =>
                                                setlostreasonset({
                                                  ...lostreasonset,
                                                  lost_reason_name:
                                                    e.target.value,
                                                })
                                              }
                                              name="lost_reason_name"
                                              id="lost_reason_name"
                                              className="form-control"
                                              placeholder="Lost Reason"
                                              autoComplete="off"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="resets-button">
                                            <button
                                              type="submit"
                                              name="submit"
                                              className="button-57"
                                            >
                                              {lostreasonset._id
                                                ? "Edit"
                                                : "Submit"}
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </form>
                                    <div className="table-responsive">
                                      <form
                                        name="leadsort"
                                        id="leadsort"
                                        method="post"
                                      >
                                        <table
                                          className="table table-bordered table-hover"
                                          id="lstable"
                                        >
                                          <thead>
                                            <tr>
                                              <th>Sr. No.</th>
                                              <th>Lost Reason</th>
                                              <th>Action</th>
                                            </tr>
                                          </thead>
                                          <tbody id="lead_source_list">
                                            {lostreason?.map(
                                              (lostreason1, key) => {
                                                const handleReasonDelete =
                                                  async () => {
                                                    const confirmDelete1 =
                                                      window.confirm(
                                                        "Are you sure you want to delete this Lead Reason?"
                                                      );

                                                    if (confirmDelete1) {
                                                      try {
                                                        // Assuming deleteLeadSource returns a promise (or is async)
                                                        await dispatch(
                                                          deleteLostReason(
                                                            lostreason1._id
                                                          )
                                                        );
                                                        toast.success(
                                                          "Delete Successfully"
                                                        );
                                                      } catch (error) {
                                                        toast.error(
                                                          "Delete Successfully"
                                                        );
                                                        console.error(
                                                          "Error deleting lead source:",
                                                          error
                                                        );
                                                      }
                                                    } else {
                                                      toast.success(
                                                        "Delete Canceled"
                                                      );
                                                      console.log(
                                                        "Delete canceled"
                                                      );
                                                    }
                                                  };
                                                return (
                                                  <tr data-fire="lMTU=">
                                                    <td>
                                                      <span data-take="lMTU=">
                                                        {key + 1}
                                                      </span>
                                                    </td>
                                                    <td>
                                                      <span data-take="lMTU=">
                                                        {
                                                          lostreason1.lost_reason_name
                                                        }
                                                      </span>
                                                    </td>
                                                    <td>
                                                      <button
                                                        type="button"
                                                        onClick={
                                                          handleReasonDelete
                                                        }
                                                        className="btn btn-danger btn-xs"
                                                      >
                                                        <i className="fa fa-trash" />
                                                      </button>
                                                      <button
                                                        type="button"
                                                        onClick={(e) =>
                                                          editLeadReason(
                                                            lostreason1._id
                                                          )
                                                        }
                                                        className="btn btn-info btn-xs"
                                                      >
                                                        <i
                                                          className="fa fa-pencil-square-o"
                                                          aria-hidden="true"
                                                        ></i>
                                                      </button>
                                                    </td>
                                                  </tr>
                                                );
                                              }
                                            )}
                                          </tbody>
                                        </table>
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="panel panel-bd d-none">
                                <div className="panel panel-bd ">
                                  <div className="panel-heading lead_source">
                                    <div className="btn-group">
                                      {" "}
                                      Task Status
                                    </div>
                                  </div>
                                </div>
                                <div className="panel-body">
                                  <div className="cards">
                                    <form
                                      method="post"
                                      name="add_lead_source"
                                      id="add_lead_source"
                                    >
                                      <div className="row">
                                        <div className="col-md-2 pd-top">
                                          <button
                                            type="button"
                                            id="addleadsource"
                                            className="btn btn-sm btn-success form-control"
                                          >
                                            Add New
                                          </button>
                                        </div>
                                        <div className="col-md-2 pd-top">
                                          <label>Task Status</label>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="form-group">
                                            <input
                                              type="hidden"
                                              name="lsid"
                                              id="lshiddenid"
                                              defaultValue=""
                                              autoComplete="off"
                                            />
                                            <input
                                              type="text"
                                              name="lead_source"
                                              id="lead_source"
                                              className="form-control"
                                              placeholder="Lead Source"
                                              autoComplete="off"
                                            />
                                            <span
                                              id="lserror"
                                              className="text-danger"
                                            />
                                            <span
                                              id="lssuccess"
                                              className="text-success"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-2">
                                          <div className="resets-button">
                                            <button
                                              type="submit"
                                              name="submit"
                                              className="button-57"
                                              autoComplete="off"
                                              placeholder="Submit"
                                            >
                                              Submit
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </form>
                                    <div className="table-responsive">
                                      <form
                                        name="leadsort"
                                        id="leadsort"
                                        method="post"
                                      >
                                        <input
                                          type="hidden"
                                          name="name"
                                          defaultValue="lead_source"
                                          autoComplete="off"
                                        />
                                        <table
                                          className="table table-bordered table-hover"
                                          id="lstable"
                                        >
                                          <thead>
                                            <tr>
                                              <th>Task Status</th>
                                              <th>
                                                Action
                                                <button
                                                  style={{ float: "right" }}
                                                  className="btn btn-sm btn-success "
                                                  type="submit"
                                                >
                                                  Sort
                                                </button>
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody id="lead_source_list">
                                            <tr data-fire="lMTU=">
                                              <td>
                                                <span data-take="lMTU=">
                                                  Call Back
                                                </span>
                                                <input
                                                  type="hidden"
                                                  name="id[]"
                                                  defaultValue="MTU="
                                                  autoComplete="off"
                                                />
                                                <input
                                                  type="hidden"
                                                  name="index[]"
                                                  defaultValue={6}
                                                  autoComplete="off"
                                                />
                                              </td>
                                              <td>
                                                <button
                                                  type="button"
                                                  onclick="editLs('MTU=');"
                                                  className="btn btn-info btn-xs"
                                                >
                                                  <i
                                                    className="fa fa-pencil-square-o"
                                                    aria-hidden="true"
                                                  ></i>
                                                </button>
                                                <button
                                                  type="button"
                                                  onclick="deleteLs('MTU=');"
                                                  className="btn btn-danger btn-xs"
                                                >
                                                  <i className="fa fa-trash" />
                                                </button>
                                              </td>
                                            </tr>
                                            <tr data-fire="lMTc=">
                                              <td>
                                                <span data-take="lMTc=">
                                                  Completed
                                                </span>
                                                <input
                                                  type="hidden"
                                                  name="id[]"
                                                  defaultValue="MTc="
                                                  autoComplete="off"
                                                />
                                                <input
                                                  type="hidden"
                                                  name="index[]"
                                                  defaultValue={7}
                                                  autoComplete="off"
                                                />
                                              </td>
                                              <td>
                                                <button
                                                  type="button"
                                                  onclick="editLs('MTc=');"
                                                  className="btn btn-info btn-xs"
                                                >
                                                  <i
                                                    className="fa fa-pencil-square-o"
                                                    aria-hidden="true"
                                                  ></i>
                                                </button>
                                                <button
                                                  type="button"
                                                  onclick="deleteLs('MTc=');"
                                                  className="btn btn-danger btn-xs"
                                                >
                                                  <i className="fa fa-trash" />
                                                </button>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div id="custome-field" className="tab-pane fade">
                              <div className="panel-body border-tbal">
                                <div className="row">
                                  <div className="col-sm-12 col-xs-12">
                                    <code>
                                      To make required field mark checkbox.
                                    </code>
                                    <div className="cardses">
                                      <form
                                        name="flsort"
                                        id="flsort1"
                                        className="flsort"
                                        method="post"
                                      >
                                        <div className="row">
                                          <div className="col-md-12">
                                            <div className="address-sec">
                                              All Details{" "}
                                              <button
                                                type="button"
                                                className="btn btn-sm btn-warning"
                                                style={{ float: "right" }}
                                                onclick="enableDrag('dtable1',this)"
                                                id="d1"
                                              >
                                                Enable Drag
                                              </button>
                                              <button
                                                style={{ float: "right" }}
                                                className="btn btn-sm btn-success"
                                                type="submit"
                                              >
                                                Sort
                                              </button>
                                            </div>
                                          </div>
                                          <div className="card-headers">
                                            <div className="headding_ex">
                                              <div className="table-responsive">
                                                <table
                                                  className="table"
                                                  id="dtable1"
                                                >
                                                  <tbody
                                                    id="sectionid1"
                                                    className="flist"
                                                  >
                                                    <input
                                                      type="hidden"
                                                      name="section"
                                                      defaultValue="MQ=="
                                                      autoComplete="off"
                                                    />
                                                    <tr data-of="MQ==">
                                                      <td>
                                                        <span data-take="fMQ==">
                                                          Full Name
                                                        </span>
                                                        <input
                                                          type="hidden"
                                                          name="id[]"
                                                          defaultValue="MQ=="
                                                          autoComplete="off"
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="index[]"
                                                          defaultValue={0}
                                                          autoComplete="off"
                                                        />
                                                        <span className="d-trans">
                                                          Drag to adjust order
                                                        </span>
                                                        <input
                                                          type="checkbox"
                                                          id="r1"
                                                          onclick="markRequired(this)"
                                                          defaultChecked=""
                                                          data-mean="MQ=="
                                                          style={{
                                                            float: "right",
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                      </td>
                                                      <td />
                                                    </tr>
                                                    <tr data-of="Mg==">
                                                      <td>
                                                        <span data-take="fMg==">
                                                          Email Id
                                                        </span>
                                                        <input
                                                          type="hidden"
                                                          name="id[]"
                                                          defaultValue="Mg=="
                                                          autoComplete="off"
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="index[]"
                                                          defaultValue={1}
                                                          autoComplete="off"
                                                        />
                                                        <span className="d-trans">
                                                          Drag to adjust order
                                                        </span>
                                                        <input
                                                          type="checkbox"
                                                          id="r2"
                                                          onclick="markRequired(this)"
                                                          data-mean="Mg=="
                                                          style={{
                                                            float: "right",
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                      </td>
                                                      <td />
                                                    </tr>
                                                    <tr data-of="Ng==">
                                                      <td>
                                                        <span data-take="fNg==">
                                                          Company Name
                                                        </span>
                                                        <input
                                                          type="hidden"
                                                          name="id[]"
                                                          defaultValue="Ng=="
                                                          autoComplete="off"
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="index[]"
                                                          defaultValue={2}
                                                          autoComplete="off"
                                                        />
                                                        <span className="d-trans">
                                                          Drag to adjust order
                                                        </span>
                                                        <input
                                                          type="checkbox"
                                                          id="r6"
                                                          onclick="markRequired(this)"
                                                          data-mean="Ng=="
                                                          style={{
                                                            float: "right",
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                      </td>
                                                      <td />
                                                    </tr>
                                                    <tr data-of="NQ==">
                                                      <td>
                                                        <span data-take="fNQ==">
                                                          Website
                                                        </span>
                                                        <input
                                                          type="hidden"
                                                          name="id[]"
                                                          defaultValue="NQ=="
                                                          autoComplete="off"
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="index[]"
                                                          defaultValue={3}
                                                          autoComplete="off"
                                                        />
                                                        <span className="d-trans">
                                                          Drag to adjust order
                                                        </span>
                                                        <input
                                                          type="checkbox"
                                                          id="r5"
                                                          onclick="markRequired(this)"
                                                          data-mean="NQ=="
                                                          style={{
                                                            float: "right",
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                      </td>
                                                      <td />
                                                    </tr>
                                                    <tr data-of="MzA=">
                                                      <td>
                                                        <span data-take="fMzA=">
                                                          Service
                                                        </span>
                                                        <input
                                                          type="hidden"
                                                          name="id[]"
                                                          defaultValue="MzA="
                                                          autoComplete="off"
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="index[]"
                                                          defaultValue={4}
                                                          autoComplete="off"
                                                        />
                                                        <span className="d-trans">
                                                          Drag to adjust order
                                                        </span>
                                                        <input
                                                          type="checkbox"
                                                          id="r30"
                                                          onclick="markRequired(this)"
                                                          data-mean="MzA="
                                                          style={{
                                                            float: "right",
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                      </td>
                                                      <td />
                                                    </tr>
                                                    <tr data-of="Mw==">
                                                      <td>
                                                        <span data-take="fMw==">
                                                          Contact No
                                                        </span>
                                                        <input
                                                          type="hidden"
                                                          name="id[]"
                                                          defaultValue="Mw=="
                                                          autoComplete="off"
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="index[]"
                                                          defaultValue={5}
                                                          autoComplete="off"
                                                        />
                                                        <span className="d-trans">
                                                          Drag to adjust order
                                                        </span>
                                                        <input
                                                          type="checkbox"
                                                          id="r3"
                                                          onclick="markRequired(this)"
                                                          defaultChecked=""
                                                          data-mean="Mw=="
                                                          style={{
                                                            float: "right",
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                      </td>
                                                      <td />
                                                    </tr>
                                                    <tr data-of="NA==">
                                                      <td>
                                                        <span data-take="fNA==">
                                                          Alternative No
                                                        </span>
                                                        <input
                                                          type="hidden"
                                                          name="id[]"
                                                          defaultValue="NA=="
                                                          autoComplete="off"
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="index[]"
                                                          defaultValue={6}
                                                          autoComplete="off"
                                                        />
                                                        <span className="d-trans">
                                                          Drag to adjust order
                                                        </span>
                                                        <input
                                                          type="checkbox"
                                                          id="r4"
                                                          onclick="markRequired(this)"
                                                          data-mean="NA=="
                                                          style={{
                                                            float: "right",
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                      </td>
                                                      <td />
                                                    </tr>
                                                    <tr data-of="MzE=">
                                                      <td>
                                                        <span data-take="fMzE=">
                                                          Position
                                                        </span>
                                                        <input
                                                          type="hidden"
                                                          name="id[]"
                                                          defaultValue="MzE="
                                                          autoComplete="off"
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="index[]"
                                                          defaultValue={7}
                                                          autoComplete="off"
                                                        />
                                                        <span className="d-trans">
                                                          Drag to adjust order
                                                        </span>
                                                        <input
                                                          type="checkbox"
                                                          id="r31"
                                                          onclick="markRequired(this)"
                                                          data-mean="MzE="
                                                          style={{
                                                            float: "right",
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                      </td>
                                                      <td />
                                                    </tr>
                                                    <tr data-of="MzI=">
                                                      <td>
                                                        <span data-take="fMzI=">
                                                          Lead Source
                                                        </span>
                                                        <input
                                                          type="hidden"
                                                          name="id[]"
                                                          defaultValue="MzI="
                                                          autoComplete="off"
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="index[]"
                                                          defaultValue={8}
                                                          autoComplete="off"
                                                        />
                                                        <span className="d-trans">
                                                          Drag to adjust order
                                                        </span>
                                                        <input
                                                          type="checkbox"
                                                          id="r32"
                                                          onclick="markRequired(this)"
                                                          data-mean="MzI="
                                                          style={{
                                                            float: "right",
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                      </td>
                                                      <td />
                                                    </tr>
                                                    <tr data-of="Nw==">
                                                      <td>
                                                        <span data-take="fNw==">
                                                          Lead Cost
                                                        </span>
                                                        <input
                                                          type="hidden"
                                                          name="id[]"
                                                          defaultValue="Nw=="
                                                          autoComplete="off"
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="index[]"
                                                          defaultValue={9}
                                                          autoComplete="off"
                                                        />
                                                        <span className="d-trans">
                                                          Drag to adjust order
                                                        </span>
                                                        <input
                                                          type="checkbox"
                                                          id="r7"
                                                          onclick="markRequired(this)"
                                                          data-mean="Nw=="
                                                          style={{
                                                            float: "right",
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                      </td>
                                                      <td />
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </form>
                                      <form
                                        name="flsort"
                                        id="flsort2"
                                        className="flsort"
                                        method="post"
                                      >
                                        <div className="row">
                                          <div className="col-md-12">
                                            <div className="address-sec">
                                              Address{" "}
                                              <button
                                                type="button"
                                                className="btn btn-sm btn-warning"
                                                style={{ float: "right" }}
                                                onclick="enableDrag('dtable2',this)"
                                                id="d2"
                                              >
                                                Enable Drag
                                              </button>
                                              <button
                                                style={{ float: "right" }}
                                                className="btn btn-sm btn-success"
                                                type="submit"
                                              >
                                                Sort
                                              </button>
                                            </div>
                                          </div>
                                          <div className="card-headers">
                                            <div className="headding_ex">
                                              <div className="table-responsive">
                                                <table
                                                  className="table"
                                                  id="dtable2"
                                                >
                                                  <tbody
                                                    id="sectionid2"
                                                    className="flist"
                                                  >
                                                    <input
                                                      type="hidden"
                                                      name="section"
                                                      defaultValue="Mg=="
                                                      autoComplete="off"
                                                    />
                                                    <tr data-of="Mjk=">
                                                      <td>
                                                        <span data-take="fMjk=">
                                                          Country
                                                        </span>
                                                        <input
                                                          type="hidden"
                                                          name="id[]"
                                                          defaultValue="Mjk="
                                                          autoComplete="off"
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="index[]"
                                                          defaultValue={0}
                                                          autoComplete="off"
                                                        />
                                                        <span className="d-trans">
                                                          Drag to adjust order
                                                        </span>
                                                        <input
                                                          type="checkbox"
                                                          id="r29"
                                                          onclick="markRequired(this)"
                                                          data-mean="Mjk="
                                                          style={{
                                                            float: "right",
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                      </td>
                                                      <td />
                                                    </tr>
                                                    <tr data-of="MjI=">
                                                      <td>
                                                        <span data-take="fMjI=">
                                                          Full Address
                                                        </span>
                                                        <input
                                                          type="hidden"
                                                          name="id[]"
                                                          defaultValue="MjI="
                                                          autoComplete="off"
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="index[]"
                                                          defaultValue={1}
                                                          autoComplete="off"
                                                        />
                                                        <span className="d-trans">
                                                          Drag to adjust order
                                                        </span>
                                                        <input
                                                          type="checkbox"
                                                          id="r22"
                                                          onclick="markRequired(this)"
                                                          data-mean="MjI="
                                                          style={{
                                                            float: "right",
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                      </td>
                                                      <td />
                                                    </tr>
                                                    <tr data-of="Mjg=">
                                                      <td>
                                                        <span data-take="fMjg=">
                                                          State
                                                        </span>
                                                        <input
                                                          type="hidden"
                                                          name="id[]"
                                                          defaultValue="Mjg="
                                                          autoComplete="off"
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="index[]"
                                                          defaultValue={2}
                                                          autoComplete="off"
                                                        />
                                                        <span className="d-trans">
                                                          Drag to adjust order
                                                        </span>
                                                        <input
                                                          type="checkbox"
                                                          id="r28"
                                                          onclick="markRequired(this)"
                                                          data-mean="Mjg="
                                                          style={{
                                                            float: "right",
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                      </td>
                                                      <td />
                                                    </tr>
                                                    <tr data-of="MzM=">
                                                      <td>
                                                        <span data-take="fMzM=">
                                                          City
                                                        </span>
                                                        <input
                                                          type="hidden"
                                                          name="id[]"
                                                          defaultValue="MzM="
                                                          autoComplete="off"
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="index[]"
                                                          defaultValue={3}
                                                          autoComplete="off"
                                                        />
                                                        <span className="d-trans">
                                                          Drag to adjust order
                                                        </span>
                                                        <input
                                                          type="checkbox"
                                                          id="r33"
                                                          onclick="markRequired(this)"
                                                          data-mean="MzM="
                                                          style={{
                                                            float: "right",
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                      </td>
                                                      <td />
                                                    </tr>
                                                    <tr data-of="MjM=">
                                                      <td>
                                                        <span data-take="fMjM=">
                                                          Pincode
                                                        </span>
                                                        <input
                                                          type="hidden"
                                                          name="id[]"
                                                          defaultValue="MjM="
                                                          autoComplete="off"
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="index[]"
                                                          defaultValue={4}
                                                          autoComplete="off"
                                                        />
                                                        <span className="d-trans">
                                                          Drag to adjust order
                                                        </span>
                                                        <input
                                                          type="checkbox"
                                                          id="r23"
                                                          onclick="markRequired(this)"
                                                          data-mean="MjM="
                                                          style={{
                                                            float: "right",
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                      </td>
                                                      <td />
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </form>
                                      <form
                                        name="flsort"
                                        id="flsort3"
                                        className="flsort"
                                        method="post"
                                      >
                                        <div className="row">
                                          <div className="col-md-12">
                                            <div className="address-sec">
                                              Additional Information{" "}
                                              <button
                                                type="button"
                                                className="btn btn-sm btn-warning"
                                                style={{ float: "right" }}
                                                onclick="enableDrag('dtable3',this)"
                                                id="d3"
                                              >
                                                Enable Drag
                                              </button>
                                              <button
                                                style={{ float: "right" }}
                                                className="btn btn-sm btn-success"
                                                type="submit"
                                              >
                                                Sort
                                              </button>
                                            </div>
                                          </div>
                                          <div className="card-headers">
                                            <div className="headding_ex">
                                              <div className="table-responsive">
                                                <table
                                                  className="table"
                                                  id="dtable3"
                                                >
                                                  <tbody
                                                    id="sectionid3"
                                                    className="flist"
                                                  >
                                                    <input
                                                      type="hidden"
                                                      name="section"
                                                      defaultValue="Mw=="
                                                      autoComplete="off"
                                                    />
                                                    <tr data-of="MjQ=">
                                                      <td>
                                                        <span data-take="fMjQ=">
                                                          Description
                                                        </span>
                                                        <input
                                                          type="hidden"
                                                          name="id[]"
                                                          defaultValue="MjQ="
                                                          autoComplete="off"
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="index[]"
                                                          defaultValue={0}
                                                          autoComplete="off"
                                                        />
                                                        <span className="d-trans">
                                                          Drag to adjust order
                                                        </span>
                                                        <input
                                                          type="checkbox"
                                                          id="r24"
                                                          onclick="markRequired(this)"
                                                          data-mean="MjQ="
                                                          style={{
                                                            float: "right",
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                      </td>
                                                      <td />
                                                    </tr>
                                                    <tr data-of="MzU=">
                                                      <td>
                                                        <span data-take="fMzU=">
                                                          Assign to agent
                                                        </span>
                                                        <input
                                                          type="hidden"
                                                          name="id[]"
                                                          defaultValue="MzU="
                                                          autoComplete="off"
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="index[]"
                                                          defaultValue={1}
                                                          autoComplete="off"
                                                        />
                                                        <span className="d-trans">
                                                          Drag to adjust order
                                                        </span>
                                                        <input
                                                          type="checkbox"
                                                          id="r35"
                                                          onclick="markRequired(this)"
                                                          defaultChecked=""
                                                          data-mean="MzU="
                                                          style={{
                                                            float: "right",
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                      </td>
                                                      <td />
                                                    </tr>
                                                    <tr data-of="MzQ=">
                                                      <td>
                                                        <span data-take="fMzQ=">
                                                          Status
                                                        </span>
                                                        <input
                                                          type="hidden"
                                                          name="id[]"
                                                          defaultValue="MzQ="
                                                          autoComplete="off"
                                                        />
                                                        <input
                                                          type="hidden"
                                                          name="index[]"
                                                          defaultValue={2}
                                                          autoComplete="off"
                                                        />
                                                        <span className="d-trans">
                                                          Drag to adjust order
                                                        </span>
                                                        <input
                                                          type="checkbox"
                                                          id="r34"
                                                          onclick="markRequired(this)"
                                                          defaultChecked=""
                                                          data-mean="MzQ="
                                                          style={{
                                                            float: "right",
                                                          }}
                                                          autoComplete="off"
                                                        />
                                                      </td>
                                                      <td />
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </form>
                                      <form
                                        name="flsort"
                                        id="flsort4"
                                        className="flsort"
                                        method="post"
                                      >
                                        <div className="row">
                                          <div className="col-md-12">
                                            <div className="address-sec">
                                              Clinic Detail{" "}
                                              <button
                                                type="button"
                                                className="btn btn-sm btn-warning"
                                                style={{ float: "right" }}
                                                onclick="enableDrag('dtable4',this)"
                                                id="d4"
                                              >
                                                Enable Drag
                                              </button>
                                              <button
                                                style={{ float: "right" }}
                                                className="btn btn-sm btn-success"
                                                type="submit"
                                              >
                                                Sort
                                              </button>
                                            </div>
                                          </div>
                                          <div className="card-headers">
                                            <div className="headding_ex">
                                              <div className="table-responsive">
                                                <table
                                                  className="table"
                                                  id="dtable4"
                                                >
                                                  <tbody
                                                    id="sectionid4"
                                                    className="flist"
                                                  >
                                                    <input
                                                      type="hidden"
                                                      name="section"
                                                      defaultValue="NA=="
                                                      autoComplete="off"
                                                    />
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </form>
                                      <form
                                        name="flsort"
                                        id="flsort5"
                                        className="flsort"
                                        method="post"
                                      >
                                        <div className="row">
                                          <div className="col-md-12">
                                            <div className="address-sec">
                                              Test 1{" "}
                                              <button
                                                type="button"
                                                className="btn btn-sm btn-warning"
                                                style={{ float: "right" }}
                                                onclick="enableDrag('dtable5',this)"
                                                id="d5"
                                              >
                                                Enable Drag
                                              </button>
                                              <button
                                                style={{ float: "right" }}
                                                className="btn btn-sm btn-success"
                                                type="submit"
                                              >
                                                Sort
                                              </button>
                                            </div>
                                          </div>
                                          <div className="card-headers">
                                            <div className="headding_ex">
                                              <div className="table-responsive">
                                                <table
                                                  className="table"
                                                  id="dtable5"
                                                >
                                                  <tbody
                                                    id="sectionid5"
                                                    className="flist"
                                                  >
                                                    <input
                                                      type="hidden"
                                                      name="section"
                                                      defaultValue="NQ=="
                                                      autoComplete="off"
                                                    />
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane"
                          id="v-pills-loginhistory"
                          role="tabpanel"
                          aria-labelledby="v-pills-loginhistory-tab"
                        >
                          <div className="row">
                            <table className="table-bordered table dataTable no-footer">
                              <thead>
                                <tr role="row">
                                  <th className="sorting_asc">#</th>
                                  <th className="sorting">Time</th>
                                  <th className="sorting">System</th>
                                  <th className="sorting">Browser</th>
                                  <th className="sorting">IP</th>
                                  <th className="sorting">Clear History </th>
                                </tr>
                              </thead>
                              <tbody id="loginHistory">
                                <tr role="row" className="odd">
                                  <td className="sorting_1">1</td>
                                  <td>05-10-2023 11:10:09</td>
                                  <td>Windows 7</td>
                                  <td>Firefox</td>
                                  <td>49.206.121.127</td>
                                  <td>
                                    National Capital Territory of Delhi, New
                                    Delhi, India
                                  </td>
                                </tr>
                                <tr role="row" className="even">
                                  <td className="sorting_1">2</td>
                                  <td>05-10-2023 10:27:27</td>
                                  <td>Windows 10</td>
                                  <td>Firefox</td>
                                  <td>49.206.121.127</td>
                                  <td>
                                    National Capital Territory of Delhi, New
                                    Delhi, India
                                  </td>
                                </tr>
                                <tr role="row" className="odd">
                                  <td className="sorting_1">3</td>
                                  <td>04-10-2023 12:13:49</td>
                                  <td>Windows 7</td>
                                  <td>Firefox</td>
                                  <td>49.206.120.231</td>
                                  <td>
                                    National Capital Territory of Delhi, New
                                    Delhi, India
                                  </td>
                                </tr>
                                <tr role="row" className="even">
                                  <td className="sorting_1">4</td>
                                  <td>04-10-2023 10:49:35</td>
                                  <td>Windows 10</td>
                                  <td>Firefox</td>
                                  <td>49.206.120.231</td>
                                  <td>
                                    National Capital Territory of Delhi, New
                                    Delhi, India
                                  </td>
                                </tr>
                                <tr role="row" className="odd">
                                  <td className="sorting_1">5</td>
                                  <td>04-10-2023 10:42:58</td>
                                  <td>Windows 10</td>
                                  <td>Chrome</td>
                                  <td>49.206.120.231</td>
                                  <td>
                                    National Capital Territory of Delhi, New
                                    Delhi, India
                                  </td>
                                </tr>
                                <tr role="row" className="even">
                                  <td className="sorting_1">6</td>
                                  <td>03-10-2023 17:42:01</td>
                                  <td>Windows 7</td>
                                  <td>Firefox</td>
                                  <td>49.206.120.142</td>
                                  <td>
                                    National Capital Territory of Delhi, New
                                    Delhi, India
                                  </td>
                                </tr>
                                <tr role="row" className="odd">
                                  <td className="sorting_1">7</td>
                                  <td>03-10-2023 13:48:22</td>
                                  <td>Windows 7</td>
                                  <td>Firefox</td>
                                  <td>49.206.120.142</td>
                                  <td>
                                    National Capital Territory of Delhi, New
                                    Delhi, India
                                  </td>
                                </tr>
                                <tr role="row" className="even">
                                  <td className="sorting_1">8</td>
                                  <td>03-10-2023 10:18:08</td>
                                  <td>Windows 10</td>
                                  <td>Firefox</td>
                                  <td>49.206.120.201</td>
                                  <td>
                                    National Capital Territory of Delhi, New
                                    Delhi, India
                                  </td>
                                </tr>
                                <tr role="row" className="odd">
                                  <td className="sorting_1">9</td>
                                  <td>02-10-2023 19:17:32</td>
                                  <td>Windows 10</td>
                                  <td>Chrome</td>
                                  <td>103.253.173.145</td>
                                  <td>
                                    National Capital Territory of Delhi, New
                                    Delhi, India
                                  </td>
                                </tr>
                                <tr role="row" className="even">
                                  <td className="sorting_1">10</td>
                                  <td>02-10-2023 18:23:25</td>
                                  <td>Windows 10</td>
                                  <td>Firefox</td>
                                  <td>103.253.173.145</td>
                                  <td>
                                    National Capital Territory of Delhi, New
                                    Delhi, India
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane"
                          id="subscription"
                          role="tabpanel"
                          aria-labelledby="v-pills-account-tab"
                        >
                          <form
                            action=" "
                            method="post"
                            name="general_setting"
                            id="general_setting"
                          >
                            <div className="row">
                              <div className="col-sm-6 col-xs-12 pd-0t">
                                <div className="cardses">
                                  <div className="row pt-3">
                                    <div className="col-md-5 pd-top">
                                      <label>Client Name </label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          disabled
                                          type="text"
                                          value={hostings["0"]?.name}
                                          name="company_name"
                                          className="form-control"
                                          defaultValue="MAGIEC ADVERTIZEMENT"
                                          placeholder="Company Name"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Contact No.</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          disabled
                                          value={hostings["0"]?.mobile}
                                          type="text"
                                          name="contact_person"
                                          className="form-control"
                                          defaultValue
                                          placeholder="Mobile"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Plan Sign Up Date</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          disabled
                                          value={datafomate(
                                            hostings["0"]?.createdAt
                                          )}
                                          type="text"
                                          name="contact_person"
                                          className="form-control"
                                          defaultValue
                                          placeholder="createdAt"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>

                                    <div className="col-md-5 pd-top">
                                      <label>Plan Name</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          disabled
                                          value={Plan(hostings["0"]?.Package)}
                                          type="text"
                                          name="contact_person"
                                          className="form-control"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-6 col-xs-12 pd-0t">
                                <div className="cardses">
                                  <div className="row  pt-3">
                                    <div className="col-md-5 pd-top">
                                      <label>Domain </label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          disabled
                                          value={hostings["0"]?.domain}
                                          name="company_address"
                                          className="form-control"
                                          placeholder="Company Address"
                                          rows={2}
                                          required
                                          defaultValue={
                                            "14B9 4th Floor Dev Nagar Karol Bagh"
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Client Email</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          type="text"
                                          disabled
                                          value={hostings["0"]?.email}
                                          name="company_zip_code"
                                          className="form-control"
                                          placeholder="Pincode"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Plan Expire Date</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          disabled
                                          value={datafomate1(
                                            datafomate(hostings["0"]?.createdAt)
                                          )}
                                          type="text"
                                          name="company_zip_code"
                                          className="form-control"
                                          defaultValue={110005}
                                          placeholder="Pincode"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 pd-top">
                                      <label>Status</label>
                                    </div>
                                    <div className="col-md-7">
                                      <div className="form-group">
                                        <input
                                          disabled
                                          value={hostings["0"]?.states}
                                          type="text"
                                          name="company_zip_code"
                                          className="form-control"
                                          defaultValue={110005}
                                          placeholder="Pincode"
                                          required
                                          autoComplete="off"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Setting;
