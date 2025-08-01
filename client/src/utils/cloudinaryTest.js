// Test script to verify Cloudinary configuration
// Run this in browser console or create a test component

export const testCloudinaryAccess = async (cloudName, uploadPreset) => {
  console.log('Testing Cloudinary configuration...');
  console.log('Cloud Name:', cloudName);
  console.log('Upload Preset:', uploadPreset);

  // Test 1: Check if cloud name is accessible
  try {
    const response = await fetch(`https://res.cloudinary.com/${cloudName}/image/upload/w_50,h_50,c_fill/sample.jpg`);
    if (response.ok) {
      console.log('✅ Cloud name is valid and accessible');
    } else {
      console.log('❌ Cloud name might be invalid or restricted');
    }
  } catch (error) {
    console.log('❌ Error accessing Cloudinary:', error);
  }

  // Test 2: Check upload preset configuration
  console.log('\n📋 To verify your upload preset:');
  console.log('1. Go to https://cloudinary.com/console');
  console.log('2. Navigate to Settings > Upload');
  console.log(`3. Find the preset "${uploadPreset}"`);
  console.log('4. Ensure it has these settings:');
  console.log('   - Signing Mode: Unsigned');
  console.log('   - Resource Type: Raw');
  console.log('   - Access Control: Public Read');
  
  return {
    cloudName,
    uploadPreset,
    dashboardUrl: 'https://cloudinary.com/console/settings/upload'
  };
};

// Usage:
// testCloudinaryAccess('ndekei', 'cv_uploads');
