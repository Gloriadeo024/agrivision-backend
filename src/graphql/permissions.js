// graphql/permissions.js
const { rule, shield, and, or } = require('graphql-shield');

// Mock user roles for example
const isAdmin = rule()((parent, args, { user }) => user?.role === 'Admin');
const isFarmer = rule()((parent, args, { user }) => user?.role === 'Farmer');
const isAnalyst = rule()((parent, args, { user }) => user?.role === 'Analyst');
const isSeniorAnalyst = rule()((parent, args, { user }) => user?.role === 'SeniorAnalyst');
const isJuniorAnalyst = rule()((parent, args, { user }) => user?.role === 'JuniorAnalyst');
const isSoilSalinityExpert = rule()((parent, args, { user }) => user?.role === 'SoilSalinityExpert');
const isSoilNutrientExpert = rule()((parent, args, { user }) => user?.role === 'SoilNutrientExpert');
const isFertilizerSpecialist = rule()((parent, args, { user }) => user?.role === 'FertilizerSpecialist');
const isWaterUsageExpert = rule()((parent, args, { user }) => user?.role === 'WaterUsageExpert');
const isCropRecommendationExpert = rule()((parent, args, { user }) => user?.role === 'CropRecommendationExpert');
const isPartnershipSpecialist = rule()((parent, args, { user }) => user?.role === 'PartnershipSpecialist');

// Custom logging for auditing unauthorized attempts
const logUnauthorizedAccess = (user, action) => {
  console.warn(`Unauthorized access attempt by ${user?.role || 'Unknown'} (ID: ${user?.id || 'N/A'}) for action: ${action}`);
};

// Emergency Override Logic
const canOverrideInEmergency = rule()((parent, args, { user, emergency }) => {
  if (emergency && user?.role === 'Admin') {
    console.log(`Emergency override activated by Admin (ID: ${user.id})`);
    return true;
  }
  return false;
});

// Granular permissions
const canViewPartnershipData = or(isAdmin, isPartnershipSpecialist);
const canManagePartnershipData = isAdmin;
const canViewCropRecommendations = or(isSeniorAnalyst, isFarmer);
const canUpdateCropRecommendations = isCropRecommendationExpert;
const canManageOwnFarm = rule()((parent, args, { user }) => {
  if (args.ownerId !== user?.id) {
    logUnauthorizedAccess(user, 'updateFarm or addFarm for another user');
    return false;
  }
  return true;
});
const canViewSensitiveData = or(isAdmin, isSeniorAnalyst);
const canEditMarketAccess = or(isAdmin, isPartnershipSpecialist);

// Permissions
const permissions = shield({
  Query: {
    user: isAdmin,
    farm: or(and(isAdmin, isFarmer), canManageOwnFarm, canOverrideInEmergency),
    market: or(isAdmin, isSeniorAnalyst, canOverrideInEmergency),
    weather: or(isAnalyst, isSeniorAnalyst, canOverrideInEmergency),
    soilSalinityData: and(isAdmin, isSoilSalinityExpert),
    soilNutrientData: and(isAdmin, isSoilNutrientExpert),
    fertilizerRecommendations: and(isAdmin, isFertilizerSpecialist),
    waterUsageData: and(isAdmin, isWaterUsageExpert),
    cropRecommendations: canViewCropRecommendations,
    partnershipData: canViewPartnershipData
  },
  Mutation: {
    addUser: isAdmin,
    updateUser: isAdmin,
    deleteUser: isAdmin,
    addFarm: or(isFarmer, canManageOwnFarm, canOverrideInEmergency),
    updateFarm: or(isFarmer, canManageOwnFarm, canOverrideInEmergency),
    deleteFarm: isAdmin,
    addMarket: canEditMarketAccess,
    updateMarket: canEditMarketAccess,
    deleteMarket: isAdmin,
    analyzeData: or(isAnalyst, isSeniorAnalyst, canOverrideInEmergency),
    addWeatherData: or(isAnalyst, isSeniorAnalyst, canOverrideInEmergency),
    addMarketAccess: canEditMarketAccess,
    addSoilSalinityData: isSoilSalinityExpert,
    addSoilNutrientData: isSoilNutrientExpert,
    addFertilizerRecommendation: isFertilizerSpecialist,
    addWaterUsageData: isWaterUsageExpert,
    addCropRecommendation: canUpdateCropRecommendations,
    addPartnershipData: canManagePartnershipData
  },
  Subscription: {
    salinityAlert: isSoilSalinityExpert,
    nutrientAlert: isSoilNutrientExpert,
    fertilizerAlert: isFertilizerSpecialist,
    marketUpdate: or(isAnalyst, isSeniorAnalyst),
    weatherAlert: or(isAnalyst, isSeniorAnalyst),
    waterUsageAlert: isWaterUsageExpert,
    cropRecommendationAlert: isCropRecommendationExpert,
    partnershipUpdate: isPartnershipSpecialist
  }
});

module.exports = permissions;
