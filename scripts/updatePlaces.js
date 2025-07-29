const mongoose = require('mongoose');
const config = require('../src/config/config');
const logger = require('../src/config/logger');
const Place = require('../src/models/places.model');

// Function to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[đĐ]/g, 'd')
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Function to update socials structure
const updateSocialsStructure = (socials) => {
  if (!socials || !Array.isArray(socials)) return [];
  
  return socials.map(social => {
    // If social is already in the new format
    if (typeof social === 'object' && social.type && social.url) {
      return social;
    }
    
    // If social is a string (old format), try to determine type from URL
    if (typeof social === 'string') {
      const url = social.toLowerCase();
      let type = 'facebook'; // default
      
      if (url.includes('instagram')) type = 'instagram';
      else if (url.includes('youtube')) type = 'youtube';
      else if (url.includes('tiktok')) type = 'tiktok';
      else if (url.includes('twitter')) type = 'twitter';
      
      return { type, url: social };
    }
    
    return social;
  });
};

const updatePlaces = async () => {
  try {
    // Connect to database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');

    // Get all places
    const places = await Place.find({});
    logger.info(`Found ${places.length} places to update`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const place of places) {
      let needsUpdate = false;
      const updates = {};

      // Check if slug is missing
      if (!place.slug) {
        updates.slug = generateSlug(place.name);
        needsUpdate = true;
        logger.info(`Generated slug for ${place.name}: ${updates.slug}`);
      }

      // Check if socials need to be updated to new structure
      if (place.socials && Array.isArray(place.socials)) {
        const updatedSocials = updateSocialsStructure(place.socials);
        if (JSON.stringify(updatedSocials) !== JSON.stringify(place.socials)) {
          updates.socials = updatedSocials;
          needsUpdate = true;
          logger.info(`Updated socials structure for ${place.name}`);
        }
      }

      // Update the place if needed
      if (needsUpdate) {
        await Place.findByIdAndUpdate(place._id, updates);
        updatedCount++;
        logger.info(`Updated place: ${place.name}`);
      } else {
        skippedCount++;
        logger.info(`Skipped place (no updates needed): ${place.name}`);
      }
    }

    logger.info(`Update completed. Updated: ${updatedCount}, Skipped: ${skippedCount}`);

  } catch (error) {
    logger.error('Error updating places:', error);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  }
};

// Run the update if this script is executed directly
if (require.main === module) {
  updatePlaces()
    .then(() => {
      logger.info('Place update script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Place update script failed:', error);
      process.exit(1);
    });
}

module.exports = { updatePlaces, generateSlug, updateSocialsStructure }; 