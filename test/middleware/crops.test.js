const { validateCropData } = require('../../middleware/crop');

const mockRequest = (body) => ({ body });
const mockResponse = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() });
const mockNext = jest.fn();

describe('Crop Middleware', () => {
  it('should call next if crop data is valid', () => {
    const req = mockRequest({ cropName: 'Maize', soilType: 'Loamy', yield: 200 });
    validateCropData(req, mockResponse(), mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 400 if crop name is missing', () => {
    const res = mockResponse();
    const req = mockRequest({ soilType: 'Loamy', yield: 200 });
    validateCropData(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Crop name is required' });
  });

  it('should return 400 if yield is negative', () => {
    const res = mockResponse();
    const req = mockRequest({ cropName: 'Maize', soilType: 'Loamy', yield: -50 });
    validateCropData(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Yield must be a positive number' });
  });

  it('should return 400 if soil type is invalid', () => {
    const res = mockResponse();
    const req = mockRequest({ cropName: 'Maize', soilType: 'Unknown', yield: 200 });
    validateCropData(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid soil type' });
  });

  it('should return 400 if yield is not a number', () => {
    const res = mockResponse();
    const req = mockRequest({ cropName: 'Maize', soilType: 'Loamy', yield: 'invalid' });
    validateCropData(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Yield must be a number' });
  });

  it('should handle missing body gracefully', () => {
    const res = mockResponse();
    const req = mockRequest(undefined); // Simulate missing body
    validateCropData(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid crop data' });
  });

  it('should handle unexpected errors gracefully', () => {
    const res = mockResponse();
    const req = mockRequest(null); // Simulate unexpected input
    try {
      validateCropData(req, res, mockNext);
    } catch (error) {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    }
  });
});
