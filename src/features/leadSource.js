import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import { async } from "q";




   export const addleadSource=createAsyncThunk("addleadSource",async(data,{rejectWithValue})=>{
           
        const responce=await fetch("https://crm-backend-1qcz.onrender.com/api/v1/add_lead_source/",{
            method:"POST",
            headers:{     
                "Content-Type":"application/json",
               }, 
               body:JSON.stringify(data)
        })  
        const result=await responce.json();
        
      if(result.success===true){  
         
         return result;
    }else{  
        return rejectWithValue(result.message);
    }  
    
   });

   export const getAllLeadSource=createAsyncThunk("getAllLeadSource",async(data,{rejectWithValue})=>{

    const responce=await fetch("https://crm-backend-1qcz.onrender.com/api/v1/all_lead_source");
    const result=await responce.json();
   
    if(result.success===true){    
        return result;   
   }else{  
       return rejectWithValue(result.message);
   }  
   })

   export const DeleteLeadSource=createAsyncThunk("DeleteLeadSource",async(_id,{rejectWithValue})=>{
        
      const responce=await fetch(`https://crm-backend-1qcz.onrender.com/api/v1/delete_lead_source/${_id}`,{
                        method:"DELETE",
          })

          const  result =await responce.json();
        
          if(result.success===true){     
            return result;   
       }else{  
           return rejectWithValue(result.message);
       }  
   })










export const leadSource=createSlice({
    name:"leadSource",
    initialState:{
        leadSourcedata:[],
       loading:false,  
       error:null,
       message:'', 
    },
    extraReducers:{
      // create add leadsource
       [addleadSource.pending]:(state) =>{
           state.loading=true; 
       },
       [addleadSource.fulfilled]:(state,action) =>{
           state.loading=false;
               
              state.leadSourcedata.leadSource.push(action.payload.leadSource); 
          // state.message=action.payload.message; 
       },
       [addleadSource.rejected]:(state,action) =>{
           state.loading=false;
           state.leadSourcedata=action.payload; 
       }, 
       /// get Alll lead Source
       [getAllLeadSource.pending]:(state) =>{
           state.loading=true; 
       },
       [getAllLeadSource.fulfilled]:(state,action) =>{
           state.loading=false;
          state.leadSourcedata=action.payload; 
          
       },
       [getAllLeadSource.rejected]:(state,action) =>{
           state.loading=false;
           state.leadSourcedata=action.payload; 
       }, 

       ///  DeleteLeadSource
       [DeleteLeadSource.pending]:(state) =>{
        state.loading=true; 
    },
    [DeleteLeadSource.fulfilled]:(state,action) =>{
        state.loading=false;
      const {_id} =action.payload.leadSource; 
         if(_id){
            state.leadSourcedata.leadSource=state.leadSourcedata.leadSource.filter((ele)=>ele._id!==_id);  
       }
     },
    [DeleteLeadSource.rejected]:(state,action) =>{
        state.loading=false;
        state.leadSourcedata=action.payload; 
    }, 


       },
})

export default  leadSource.reducer;