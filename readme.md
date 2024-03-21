# Singapore API Service

## Description

This project is a Node.js application that provides various APIs related to Singapore's transportation and tourism data. It utilizes Express.js as the web framework and Axios for making HTTP requests to external APIs. The APIs include functionalities such as retrieving bus stops, bicycle parking locations, taxi stands, car parks, bus arrival timings, directions, and searching for places of interest.

## Live Link
https://restful-api-project1.onrender.com

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/lurbh/Restful-API-Project1.git
   ```

2. Navigate to the project directory:
    ```bash
    cd Project-1
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Create a .env file in the project directory and add the following environment variables:
    ```bash
    STB_URL = "https://api.stb.gov.sg"
    DATASET_API = "/content/common/v2/datasets"
    TIH_SEARCH_API = "/content/common/v2/search"
    MEDIA_DOWNLOAD_API = "/media/download/v2/"
    HEADERTIH = <Register For Account https://tih-dev.stb.gov.sg>
    ONEMAPLOGIN_EMAIL = <Register For Account on https://www.onemap.gov.sg/apidocs/>
    ONEMAPLOGIN_PASSWORD = <Register For Account on https://www.onemap.gov.sg/apidocs/>
    ONEMAP_URL = "https://www.onemap.gov.sg"
    ROUTING_API = "/api/public/routingsvc/route"
    ACCESS_API = "/api/auth/post/getToken"
    ONEMAP_SEARCH_API= "/api/common/elastic/search"
    REVGEOCODE_API = "/api/public/revgeocode"
    LTA_DATAMALL_URL = "http://datamall2.mytransport.sg"
    BUS_STOP_API = "/ltaodataservice/BusStops"
    TAXI_STANDS_API = "/ltaodataservice/TaxiStands"
    BICYCLE_PARKING_API = "/ltaodataservice/BicycleParkingv2"
    CARPARKAPI = "/ltaodataservice/CarParkAvailabilityv2"
    BUS_ARRIVAL_URL = "/ltaodataservice/BusArrivalv2"
    HEADERDM = <Register For Account on https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html>
    ```

4. Start the server:
    ```bash
    node index.js
    ```

## Usage
Once the server is running, you can access the APIs using the provided endpoints. Here are some of the available endpoints:

```
/BusStops: Get information about bus stops.
/BicycleParking: Get information about bicycle parking locations.
/TaxiStands: Get information about taxi stands.
/Carpark: Get information about car parks.
/BusStops/:BusStopCode: Get bus arrival timings at a specific bus stop.
/OneMap/Directions: Get directions between two points.
/OneMap/DirectionsPT: Get directions between two points for public transport.
/OneMap/Search: Search for places of interest (Postal Code/Road/Building Name).
/OneMap/Geocode: Reverse geocode a location.
/TIH/Search: Search for places of interest (From STB Datasets).
```

For detailed usage instructions of each endpoint, refer to the code comments and documentation.

## Contributing
Contributions to this project are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.