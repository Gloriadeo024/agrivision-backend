# AgriVision System

## 🌿 Overview

AgriVision is a cutting-edge AI-powered platform designed to revolutionize coastal agriculture through predictive analytics, real-time data monitoring, IoT sensor integrations, drone-based field assessments, and blockchain-enabled market access. The system emphasizes the use of **IoT sensors** — including **temperature sensors**, **soil moisture sensors**, **pH monitors**, **nutrient sensors**, **water level detectors**, and **soil salinity sensors** — to gather critical farm data. Additionally, **AI-powered drones** provide aerial surveillance for **crop health monitoring**, **field mapping**, **pest detection**, and **cloud seeding assessments**. These drones also analyze **vegetation indices**, **irrigation efficiency**, and enable **auto-irrigation settings** by syncing with water level sensors — supporting precision agriculture solutions even in unpredictable climates. The platform also incorporates **flood detection systems** to monitor coastal water levels and trigger **automated flood response protocols**, helping mitigate potential crop damage.

## 🌏 Multi-Language Support

AgriVision supports **Kiswahili**, Mijikenda & Pokomo ensuring inclusivity for coastal communities.

## 🌿 Weed Detection

AgriVision employs AI algorithms integrated into drone technology to detect and differentiate weeds from crops in real-time. By analyzing high-resolution imagery, the system identifies areas of unwanted vegetation, allowing farmers to target herbicide application with precision or schedule manual weeding operations. This reduces chemical overuse, cuts costs, and boosts crop yield.

## 📊 Vegetation Indices and Weed Management

The platform uses **vegetation indices** — such as the **Normalized Difference Vegetation Index (NDVI)** — to assess plant health, canopy cover, and stress levels. These indices also highlight inconsistencies in crop growth, often pointing to weed infestations. By cross-referencing AI weed detection data with vegetation indices, AgriVision provides a comprehensive overview of field health, helping farmers take proactive measures against invasive plants.

## 🌊 Soil Salinity Management

AgriVision actively monitors **soil salinity levels** through IoT sensors and provides real-time alerts when levels exceed safe thresholds. The platform recommends the following measures in case of high salinity:

- **Leaching:** Applying excess water to dissolve and flush out salts from the root zone.
- **Soil Amendments:** Suggests adding gypsum (calcium sulfate) to displace sodium ions.
- **Drainage Improvement:** Identifies areas where better drainage systems should be installed.
- **Salt-Tolerant Crops:** Advises shifting to salt-resistant crop varieties.
- **Crop Rotation:** Recommends rotating salt-sensitive crops with salt-tolerant species to restore soil health.

## 🌿 Fertilizer Recommendation System

AgriVision integrates AI-powered analysis of soil data to recommend the most suitable fertilizer types based on real-time nutrient levels, pH balance, and soil salinity. The system categorizes fertilizers into:

- **Nitrogen-based fertilizers** for boosting leaf growth.
- **Phosphorus-based fertilizers** to enhance root development.
- **Potassium-based fertilizers** for improving plant disease resistance.
- **Organic compost** options for sustainable farming practices.

Farmers receive tailored suggestions to maximize crop yields without over-fertilizing, protecting both their produce and the environment.

## 🌊 AI-Powered Predictive Alerts

AgriVision integrates advanced AI models to deliver **predictive alerts** for soil salinity changes, crop health risks, and flood threats. Using real-time data streams from IoT sensors, the system forecasts potential hazards, empowering farmers to take preventive actions before damage occurs. These AI-driven alerts enhance proactive decision-making and improve overall farm resilience.

## 🔥 API Documentation

API routes are documented using Swagger. To access:

Visit [http://localhost:5001/api-docs](http://localhost:5001/api-docs) after starting the app.

Explore AI models, blockchain transactions, and weather routes.

## 🌐 Environment Variables

Create a `.env` file in the backend with the following:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
PORT=5001
```

## 📢 Subscriptions and Ads

AgriVision offers a flexible subscription model tailored to the needs of coastal farmers, agribusinesses, and agricultural researchers.

### 🎯 **Subscription Tiers**

- **Free Tier:** Access to basic farm analytics, weather data, and IoT sensor readings.
- **Pro Tier:** AI-powered predictive alerts, drone data analysis, and blockchain transaction tracking.
- **Enterprise Tier:** Full access to AI model retraining pipelines, real-time anomaly detection, and multi-farm management with advanced reporting tools.

### 📊 **Ad Integration**

AgriVision provides ad slots for agricultural suppliers, eco-friendly product manufacturers, and farming technology companies. Ads are displayed non-intrusively, ensuring users receive relevant product suggestions without compromising the user experience.

### 💳 **Payment Integration**

AgriVision supports secure, seamless payment processing for subscriptions and services. Our system integrates with trusted payment gateways such as **M-Pesa**, **PayPal**, and **Stripe**, ensuring fast and reliable transactions. To protect user data, we adhere to **PCI DSS compliance** standards, encrypt all sensitive payment information, and enable multi-currency support.

## ✨ Contributing

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

We welcome contributions to enhance AgriVision’s AI capabilities, security, and scalability.

## 🛡️ Security

- **Rate Limiting:** Redis-backed rate limiting.
- **Data Encryption:** TLS for data in transit, AES for data at rest.
- **OAuth & MFA:** Planned for next phase.

## 🎯 Roadmap

- **Phase 1:** AI model retraining & real-time WebSocket monitoring.
- **Phase 2:** Kubernetes auto-scaling & advanced security (OAuth, MFA).
- **Phase 3:** Enhanced blockchain integration & multilingual PWA support.

## 📦 Deployment

### Docker

Ensure you have Docker and Docker Compose installed.

1. **Build Docker images:**
   ```bash
   docker-compose build
   ```
2. **Run the containers:**
   ```bash
   docker-compose up -d
   ```
3. **Check running containers:**
   ```bash
   docker ps
   ```

The backend runs on port `5001` and the frontend on port `3000`.

### Kubernetes

Deploy AgriVision using Kubernetes.

1. **Apply the deployment and services:**
   ```bash
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```
2. **Check running pods:**
   ```bash
   kubectl get pods
   ```
3. **Port forward to access the app:**
   ```bash
   kubectl port-forward service/agrivision-backend 5001:5001
   ```

## 📧 Contact

For support or collaboration, reach out to:

- **Support:** [support@agrivision.com](mailto:support@agrivision.com)
- **DevOps:** [devops@agrivision.com](mailto:devops@agrivision.com)
- **Twitter:** [@AgriVisionAI](https://twitter.com/AgriVisionAI)

## 🏆 License

Licensed under the MIT License.

Stay tuned for groundbreaking innovation in coastal agriculture! 🌿

