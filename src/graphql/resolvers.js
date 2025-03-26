// resolvers.js
const User = require('./models/User');
const Farm = require('./models/Farm');
const Crop = require('./models/Crop');
const AIModel = require('./models/AIModel');

const resolvers = {
  Query: {
    hello: () => "Hello, AgriVision!",
    getUsers: async () => await User.find(),
    getUser: async (_, { id }) => await User.findById(id),
    getFarms: async () => await Farm.find(),
    getFarm: async (_, { id }) => await Farm.findById(id),
    getCrop: async (_, { id }) => {
      try {
        return await Crop.findById(id);
      } catch (error) {
        console.error('Error fetching crop:', error);
        throw new Error('Failed to fetch crop');
      }
    },
    getCrops: async () => {
      try {
        return await Crop.find();
      } catch (error) {
        console.error('Error fetching crops:', error);
        throw new Error('Failed to fetch crops');
      }
    },
    predictCropYield: async (_, { farmId, weights }) => {
      try {
        const predictions = await AIModel.predictYield(farmId, weights);
        const pestRisks = await AIModel.assessPestRisk(farmId);
        const seasonalTrends = await AIModel.analyzeSeasonalTrends(farmId);
        const anomalies = AIModel.detectAnomalies(predictions);
        
        return predictions.map(prediction => ({
          ...prediction,
          confidence: AIModel.calculateConfidence(prediction, weights),
          pestRisk: pestRisks[prediction.cropType] || 'Unknown',
          seasonalTrend: seasonalTrends[prediction.cropType] || 'Neutral',
          anomalies: anomalies[prediction.cropType] || [],
          recommendations: AIModel.suggestAlternatives(prediction.cropType, farmId)
        }));
      } catch (error) {
        console.error('Error predicting crop yield:', error);
        throw new Error('Failed to predict crop yield');
      }
    },
    analyzeSoilSalinity: async (_, { farmId, weights }) => {
      try {
        const analysis = await AIModel.analyzeSoilSalinity(farmId, weights);
        const anomalies = AIModel.detectAnomalies(analysis);
        const confidence = AIModel.calculateConfidence(analysis, weights);
        const treatmentPlans = AIModel.recommendSoilTreatment(farmId);
        const aiTriggers = AIModel.checkRealTimeTriggers(farmId, analysis);
        return { ...analysis, anomalies, confidence, treatmentPlans, aiTriggers };
      } catch (error) {
        console.error('Error analyzing soil salinity:', error);
        throw new Error('Failed to analyze soil salinity');
      }
    },
    recommendCrops: async (_, { farmId }) => {
      try {
        const recommendations = await AIModel.recommendCrops(farmId);
        return recommendations;
      } catch (error) {
        console.error('Error recommending crops:', error);
        throw new Error('Failed to recommend crops');
      }
    },
  },
  Mutation: {
    registerUser: async (_, { name, email, password, role }) => {
      const newUser = new User({ name, email, password, role: role || 'user' });
      await newUser.save();
      return newUser;
    },
    assignUserRole: async (_, { userId, role }) => {
      const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
      return user;
    },
    addFarm: async (_, { name, location, size, ownerId }) => {
      const newFarm = new Farm({ name, location, size, owner: ownerId });
      await newFarm.save();
      return newFarm;
    },
    addComment: async (_, { cropId, user, message }) => {
      try {
        const crop = await Crop.findById(cropId);
        if (!crop) throw new Error('Crop not found');
        const newComment = { user, message, createdAt: new Date().toISOString() };
        crop.comments.push(newComment);
        await crop.save();
        return crop;
      } catch (error) {
        console.error('Error adding comment:', error);
        throw new Error('Failed to add comment');
      }
    },
    recalculateSalinity: async (_, { farmId, newData, weights }) => {
      try {
        const updatedModel = await AIModel.adaptiveLearning(farmId, newData);
        const result = await AIModel.recalculateSalinity(farmId, weights);
        const confidence = AIModel.calculateConfidence(result, weights);
        const anomalies = AIModel.detectAnomalies(result);
        const treatmentPlans = AIModel.recommendSoilTreatment(farmId);
        const aiTriggers = AIModel.checkRealTimeTriggers(farmId, result);
        return { ...result, confidence, anomalies, treatmentPlans, modelUpdated: updatedModel, aiTriggers };
      } catch (error) {
        console.error('Error recalculating salinity with adaptive learning:', error);
        throw new Error('Failed to recalculate soil salinity with adaptive learning');
      }
    },
  },
};

module.exports = resolvers;
