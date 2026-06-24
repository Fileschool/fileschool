// src/filestackConfig.js
import * as filestack from 'filestack-js';

const API_KEY = 'YOUR_API_KEY'; // Replace with your Filestack API key
export const client = filestack.init(API_KEY);
