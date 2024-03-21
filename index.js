const express = require('express');

// CORS: cross origin resources sharing
const cors = require('cors');
const axios = require('axios');

const app = express();
require('dotenv').config();

// enable CORS (so that other web pages can use our RESTFUl API)
app.use(cors());

// enable recieving and sending of JSON
app.use(express.json());
app.use(express.static('public'));

const STB_URL = process.env.STB_URL;
const DATASET_API = process.env.DATASET_API;
const TIH_SEARCH_API = process.env.TIH_SEARCH_API;
const headertih = { 
    'x-api-key': process.env.HEADERTIH,
};
const onemapdata = JSON.stringify({
    "email": process.env.ONEMAPLOGIN_EMAIL,
    "password": process.env.ONEMAPLOGIN_PASSWORD
});
const ONEMAP_URL = process.env.ONEMAP_URL;
const ROUTING_API = process.env.ROUTING_API;
const ACCESS_API = process.env.ACCESS_API;
const ONEMAP_SEARCH_API= process.env.ONEMAP_SEARCH_API;
const REVGEOCODE_API = process.env.REVGEOCODE_API;
let ACCESS_TOKEN; 
let headerom;
const LTA_DATAMALL_URL = process.env.LTA_DATAMALL_URL;
const BUS_STOP_API = process.env.BUS_STOP_API;
const TAXI_STANDS_API = process.env.TAXI_STANDS_API;
const BICYCLE_PARKING_API = process.env.BICYCLE_PARKING_API;
const CARPARKAPI = process.env.CARPARKAPI;
const BUS_ARRIVAL_URL = process.env.BUS_ARRIVAL_URL;
const headerdm = { 
    'AccountKey': process.env.HEADERDM
};

function PadNo(no)
{
    let padno = no.toString()
    if(padno.length == 1)
    {
        padno = "0".concat(padno);
    }
    return padno;
}

async function LoadBusData(skip = 0)
{
    const response  = await axios.get(`${LTA_DATAMALL_URL}${BUS_STOP_API}`,{
        params: 
        {
            $skip : skip
        },
        headers : headerdm
    });
    // console.log(response.data);
    return response.data;
}

async function LoadBicycleParking(location)
{
    const response  = await axios.get(`${LTA_DATAMALL_URL}${BICYCLE_PARKING_API}`,{
        params: 
        {
            Lat : location.Lat,
            Long: location.Lng,
            Dist: 5

        },
        headers : headerdm
    });
    // console.log(response.data.value);
    return response.data.value;
} 

async function LoadTaxiStands()
{
    const response  = await axios.get(`${LTA_DATAMALL_URL}${TAXI_STANDS_API}`,{
        headers : headerdm
    });
    // console.log(response.data.value);
    return response.data.value;
}

async function LoadCarParks(skip = 0)
{
    const response  = await axios.get(`${LTA_DATAMALL_URL}${CARPARKAPI}`,{
        params: 
        {
            $skip : skip
        },
        headers : headerdm
    });
    // console.log(response.data.value);
    return response.data.value;
}

async function LoadGetBusesAtBusstop(busstopcode)
{
    const response  = await axios.get(`${LTA_DATAMALL_URL}${BUS_ARRIVAL_URL}`,{
        params: 
        {
            BusStopCode : busstopcode
        },
        headers : headerdm
    });
    // console.log(response.data.Services);
    return response.data.Services;
}

async function GetBusTimings(busstopcode,busno)
{
    const response  = await axios.get(`${LTA_DATAMALL_URL}${BUS_ARRIVAL_URL}`,{
        params: 
        {
            BusStopCode : busstopcode,
            ServiceNo : busno
        },
        headers : headerdm
    });
    // console.log(response.data.Services);
    return response.data.Services;
}

async function GetDataset()
{
  const url = `${STB_URL}${DATASET_API}`;
    const response = await axios.get(url,{
        headers : headertih
    });
  return response.data.data;
}

async function SearchSTB(searchtype,searchterms,offset)
{
  const url = `${STB_URL}${TIH_SEARCH_API}`;
  const response = await axios.get(url,{
      params: 
      {
        dataset : searchtype,
        keyword : searchterms,
        limit : 50,
        offset : offset
      },
      headers : headertih
  });
  // console.log(response.data);
  return response.data;
}

async function LoadOneMap()
{
    ACCESS_TOKEN = await getAccessToken();
    headerom = {
        Authorization : `${ACCESS_TOKEN}`
    }
    return ACCESS_TOKEN;
}

async function getAccessToken()
{
    let response = await axios.post(`${ONEMAP_URL}${ACCESS_API}`, onemapdata, {
        headers: {
            'Content-Type': 'application/json'
          }
    });
    // console.log(response.data);
    return response.data.access_token;
}

async function GetDirections(from,to,routetype)
{
    // console.log(from,to);
    // let coordinates = `${from.lng.toFixed(6)},${from.lat.toFixed(6)};${to.lng.toFixed(6)},${to.lat.toFixed(6)}`;
    // console.log(`${ONEMAP_URL}${ROUTING_API}`);
    let response = await axios.get(`${ONEMAP_URL}${ROUTING_API}`,{
        params: 
        {
           start : `${from.Lat},${from.Lng}`,
           end : `${to.Lat},${to.Lng}`,
           routeType : routetype
        }, 
        headers: headerom
    });
    // console.log(response.data);
    return response.data;
}

async function GetDirectionsPublicTransport(from,to)
{
    await LoadOneMap()
    // console.log(from,to);
    let datetime = new Date();
    // console.log(datetime);
    let date = `${PadNo(datetime.getMonth() + 1)}-${PadNo(datetime.getDate())}-${datetime.getFullYear()}`;
    let time = `${datetime.getHours()}${datetime.getMinutes()}00`;
    // let coordinates = `${from.lng.toFixed(6)},${from.lat.toFixed(6)};${to.lng.toFixed(6)},${to.lat.toFixed(6)}`;
    // console.log(`${ONEMAP_URL}${ROUTING_API}`);
    let response = await axios.get(`${ONEMAP_URL}${ROUTING_API}`, {
        params: 
        {
           start : `${from.Lat},${from.Lng}`,
           end : `${to.Lat},${to.Lng}`,
           routeType : 'pt',
           date : date,
           time : time,
           mode : "TRANSIT",
           maxWalkDistance : 1000,
           numItineraries : 3
        }, 
        headers: headerom
    });
    // console.log(response.data);
    return response.data;
}

async function SearchOneMap(keyword, pageNo = 1)
{
    // console.log(headerom);
    let response = await axios.get(`${ONEMAP_URL}${ONEMAP_SEARCH_API}`,{
        params: 
        {
           searchVal : keyword,
           returnGeom : "Y",
           getAddrDetails : "Y",
           pageNum : pageNo
        }, 
        headers: headerom
    });
    // console.log(response.data);
    return response.data;
}

async function GeoCodeFromLatLng(lat,lng)
{
    const location = `${lat},${lng}`
    let response = await axios.get(`${ONEMAP_URL}${REVGEOCODE_API}`,{
        params: 
        {
            location : location,
            buffer : 100,
            addressType : "All",
            otherFeatures : "Y"
        }, 
        headers: headerom
    });
    // console.log(response.data);
    return response.data;
}

async function main()
{
    await LoadOneMap();

    app.get("/", function(req,res){
        console.log("Test")
        res.status(200);
        res.json({
            "message":"Success"
        })
    });

    app.get("/BusStops/", async function(req,res){
        const skip = req.query.skip;
        const response = await LoadBusData(skip);
        res.json({
            "message":"Success",
            "data" : response
        })
    });

    app.get("/BicycleParking/", async function(req,res){
        const lat = req.query.lat;
        const lng = req.query.lng;
        const location = { 
            Lat: lat,
            Lng: lng
        }
        const response = await LoadBicycleParking(location);
        res.json({
            "message":"Success",
            "data" : response
        })
    });

    app.get("/TaxiStands/", async function(req,res){
        const response = await LoadTaxiStands();
        res.json({
            "message":"Success",
            "data" : response
        })
    });

    app.get("/Carpark/", async function(req,res){
        const skip = req.query.skip;
        const response = await LoadCarParks(skip);
        res.json({
            "message":"Success",
            "data" : response
        })
    });

    app.get("/BusStops/:BusStopCode", async function(req,res){
        const busstopcode = req.params.BusStopCode;
        const response = await LoadGetBusesAtBusstop(busstopcode);
        res.json({
            "message":"Success",
            "data" : response
        })
    });

    app.get("/BusStops/:BusStopCode/:BusNo", async function(req,res){
        const busstopcode = req.params.BusStopCode;
        const busNo = req.params.BusNo;
        const response = await GetBusTimings(busstopcode,busNo);
        res.json({
            "message":"Success",
            "data" : response
        })
    });

    app.get("/Dataset", async function(req,res){
        const response = await GetDataset();
        res.json({
            "message":"Success",
            "data" : response
        })
    });

    app.get("/TIH/Search", async function(req,res){
        const type = req.query.type;
        const terms = req.query.terms;
        const offset = req.query.offset;
        const response = await SearchSTB(type,terms,offset);
        res.json({
            "message":"Success",
            "data" : response
        })
    });

    app.get("/OneMap", async function(req,res){
        try{
            const response = await LoadOneMap();
            res.json({
                "message":"Success",
                "data" : response
            })
        }catch(error)
        {
            console.log(error.message)
        }
    });

    app.get("/OneMap/Directions", async function(req,res){
        const fromlat = req.query.fromlat;
        const fromlng = req.query.fromlng;
        const tolat = req.query.tolat;
        const tolng = req.query.tolng;
        const routetype = req.query.routetype;
        const from = { 
            Lat: fromlat,
            Lng: fromlng
        };
        const to = { 
            Lat: tolat,
            Lng: tolng
        };
        try
        {
            const response = await GetDirections(from,to,routetype);
            res.json({
                "message":"Success",
                "data" : response
            })
        }
        catch(error)
        {
            console.log(error.message)
        }
    });

    app.get("/OneMap/DirectionsPT", async function(req,res){
        const fromlat = req.query.fromlat;
        const fromlng = req.query.fromlng;
        const tolat = req.query.tolat;
        const tolng = req.query.tolng;
        const from = { 
            Lat: fromlat,
            Lng: fromlng
        };
        const to = { 
            Lat: tolat,
            Lng: tolng
        };
        try
        {
            const response = await GetDirectionsPublicTransport(from,to);
            res.json({
                "message":"Success",
                "data" : response
            })
        }
        catch(error)
        {
            console.log(error.message)
        }
    });

    app.get("/OneMap/Search", async function(req,res){
        const keyword = req.query.keyword;
        const pageno = req.query.pageno;
        try
        {
            const response = await SearchOneMap(keyword,pageno);
            res.json({
                "message":"Success",
                "data" : response
            })
        }
        catch(error)
        {
            console.log(error.message)
        }
    });

    app.get("/OneMap/Geocode", async function(req,res){
        const lat = req.query.lat;
        const lng = req.query.lng;
        try
        {
            const response = await GeoCodeFromLatLng(lat,lng);
            res.json({
                "message":"Success",
                "data" : response
            })
        }
        catch(error)
        {
            console.log(error.message)
        }
    });
}

main();

app.listen(3030, function(){
    console.log("server has started at http://localhost:" + 3030);
});