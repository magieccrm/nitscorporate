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
import axios from "axios";
import { Button } from "bootstrap";


export default function ImportLead() {
  const apiUrl = process.env.REACT_APP_API_URL;    
    const [leaddata, setleaddata] = useState({});
  const { ProductService } = useSelector((state) => state.ProductService);
  const { leadSourcedata } = useSelector((state) => state.leadSource);
  const { Statusdata } = useSelector((state) => state.StatusData);
  const { CountryState } = useSelector((state) => state.Country_State);
  const { StateByCountry } = useSelector((state) => state.getStateByCountry);

  const { agent } = useSelector((state) => state.agent);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProductService());
    dispatch(getAllLeadSource());
    dispatch(getAllStatus());
    dispatch(getAllCountry());
    // dispatch(getAllAgent());
    if(localStorage.getItem("role")==='admin'){ 
      dispatch(getAllAgent());
    }
    if(localStorage.getItem("role")==='TeamLeader'){
      dispatch(getAllAgentWithData({assign_to_agent:localStorage.getItem("user_id")}));
    }
  }, []);


  const [file, setFile] = useState(null);
  const [leadSource, setLeadSource] = useState('');
  const [service, setService] = useState('');
  const [status, setStatus] = useState('');
  const [country, setCountry] = useState('');
  const [assignToAgent, setAssignToAgent] = useState('');
  const [state, setState] = useState('');
  const handleInputChange = (e) => {
    // setleaddata({ ...leaddata, country: e.target.value });
    setCountry(e.target.value)
    getStateByCountry(e.target.value); 
  };  

  const getStateByCountry = (data) => {
    dispatch(getStatebycountry(data));
  };

  const allowedFileTypes = ["text/csv"];
  const filesety = (e) => {
    const selectedFile = e.target.files && e.target.files[0];

    if (selectedFile) {
      if (allowedFileTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        toast.error("Invalid file type");
      }
    }
  
  };


  const handleFileChange1 = (e) => {
    setLeadSource(e.target.value);
  };
  const handleFileChange2 = (e) => {
    setService(e.target.value);
  };
  const handleFileChange3 = (e) => {
    setStatus(e.target.value);
  };
 
  const handleFileChange5 = (e) => {
    setAssignToAgent(e.target.value);
  };
  const handleFileChange6 = (e) => {
    setState(e.target.value);
  };

  



  const handleFormSubmit = async (e) => {
    e.preventDefault();
   if(!file){
    return alert('File Is Required');
   }
   if(!leadSource){
    return alert('lead Source Required');
   }
   if(!service){
    return alert('Service Is Required');
   }
   if(!status){
    return alert('Status Is Required');
   }
   if(!country){
    return alert('Country Is Required');
   }
   if(!assignToAgent){
    return alert('AssignToAgent Is Required');
   }
   if(!state){
    return alert('State Is Required');
   }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('lead_source', leadSource);
    formData.append('service', service);
    formData.append('status', status);
    formData.append('country', country);
    formData.append('assign_to_agent', assignToAgent);
    formData.append('state', state);
   try {
      const response = await fetch(`${apiUrl}/import`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      toast.success(data.message)
      setTimeout(()=>{ 
      //  window.location.reload(false);
        }, 500); 
      console.log('API Response:', data);
    } catch (error) {

      toast.warn(error.data.message)
      console.error('Error:', error.message);
    }
  };

  const handleDownload = () => {
   const fileUrl = 'Excel/sample.csv';
   const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.download = 'sample.csv'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div>
      <div className="content-wrapper">
        <section className="content content-header">
          <div className="row">
            <div className="col-sm-12">
              <div className="panel panel-bd">
                <div className="panel-heading bg-white">
                  <div className="btn-group">Import Lead</div>
                </div>
                <div className="panel-body">
                  <form
                  
                    encType="multipart/form-data"
                  >
                    <div className="col-sm-12 col-md-12 col-xs-12">
                      <div className="cards">
                        <div className="card-headers">
                          <div className="importa-leading">
                          <div className="row"><div className="col-md-4">
                              <div className="form-group">
                                <lable className="imprt-lable">
                                  Select File  (CSV File)
                                </lable>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <input
                                  name="file"
                                  type="file" onChange={filesety}
                                  className="file-set"
                                  autoComplete="off"
                                  required />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group">
                                <button type="button" onClick={handleDownload} className="btn btn-danger button-57">
                                 Download Sample File
                                </button>
                              </div>
                            </div></div>
                            

                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <select
                                  className="form-control"
                                  name="lead_source"
                                  required 
                                  onClick={handleFileChange1}
                                  >
                                  <option value="">Select Lead Source</option>
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
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <select
                                  className="form-control"
                                  name="service"
                                  required
                                  onClick={handleFileChange2}
                                >
                                  <option value="">Select Service</option>
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
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <select className="form-control" 
                                 onClick={handleFileChange3}
                                name="status" required >
                                  <option value="">Select Status</option>
                                  {Statusdata?.leadstatus?.map(
                                    (status, key) => {
                                      return (
                                        <option value={status._id}>
                                          {status.status_name}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <select   onChange={handleInputChange} className="form-control" name="country" required >
                                  <option value="">Select Country</option>
                                  {CountryState?.country?.map((country1, key) => {
                              return (
                                <option value={country1?.isoCode}>
                                  {country1.name}{" "}
                                </option>
                              );
                            })}
                                </select>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-group">
                                <select
                                  className="form-control"
                                  name="assign_to_agent"
                                  onClick={handleFileChange5}
                               required >
                                  <option value="">
                                    Select Assign to agent
                                  </option>
                                  {agent?.agent?.map((agents, key) => {
                                    return (
                                      <option value={agents._id}>
                                        {agents.agent_name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <select className="form-control" 
                                  onClick={handleFileChange6}
                                name="state" required >
                                  <option value="">Select State</option>
                                  {StateByCountry?.state?.map((state1, key) => {
                              return (
                                <option value={state1.name}>
                                  {state1.name}
                                </option>
                              );
                            })}
                                </select>
                              </div>
                            </div>

                            <div
                              className="col-md-6"
                              style={{ float: "right" }}
                            >
                              <button className="btn btn-primary form-control"  onClick={handleFormSubmit} >
                                Next
                              </button>
                            </div>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

           
          </div>
        </section>
      </div>
    </div>
  );
}
