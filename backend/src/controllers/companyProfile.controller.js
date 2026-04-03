const asyncHandler = require('../utils/asyncHandler');
const { CompanyProfile } = require('../models');

const DEFAULT_COMPANY_PROFILE = {
  id: 1,
  address: 'Cocody Angré, Abidjan, Côte d’Ivoire',
  email: 'amena.cons@gmail.com',
  phone: '+225 07 49 64 40 55 / +225 27 24 18 77',
  websiteUrl: null,
  facebookUrl: null,
  linkedinUrl: null,
  instagramUrl: null,
};

function hasOwnProperty(source, key) {
  return Object.prototype.hasOwnProperty.call(source, key);
}

async function getOrCreateCompanyProfile() {
  const [profile] = await CompanyProfile.findOrCreate({
    where: { id: 1 },
    defaults: DEFAULT_COMPANY_PROFILE,
  });

  return profile;
}

const getCompanyProfile = asyncHandler(async (req, res) => {
  const profile = await getOrCreateCompanyProfile();
  res.status(200).json({ data: profile });
});

const updateCompanyProfile = asyncHandler(async (req, res) => {
  const profile = await getOrCreateCompanyProfile();

  await profile.update({
    address: hasOwnProperty(req.body, 'address') ? req.body.address : profile.address,
    email: hasOwnProperty(req.body, 'email') ? req.body.email : profile.email,
    phone: hasOwnProperty(req.body, 'phone') ? req.body.phone : profile.phone,
    websiteUrl: hasOwnProperty(req.body, 'websiteUrl') ? req.body.websiteUrl : profile.websiteUrl,
    facebookUrl: hasOwnProperty(req.body, 'facebookUrl') ? req.body.facebookUrl : profile.facebookUrl,
    linkedinUrl: hasOwnProperty(req.body, 'linkedinUrl') ? req.body.linkedinUrl : profile.linkedinUrl,
    instagramUrl: hasOwnProperty(req.body, 'instagramUrl') ? req.body.instagramUrl : profile.instagramUrl,
  });

  res.status(200).json({
    message: 'Company profile updated successfully.',
    data: profile,
  });
});

module.exports = {
  getCompanyProfile,
  updateCompanyProfile,
};