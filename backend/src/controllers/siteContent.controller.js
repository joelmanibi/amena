const asyncHandler = require('../utils/asyncHandler');
const { SiteContent } = require('../models');

const DEFAULT_SITE_CONTENT = {
  id: 1,
  fr: {},
  en: {},
};


function hasOwnProperty(source, key) {
  return Object.prototype.hasOwnProperty.call(source, key);
}

async function getOrCreateSiteContent() {
  const [content] = await SiteContent.findOrCreate({
    where: { id: 1 },
    defaults: DEFAULT_SITE_CONTENT,
  });

  return content;
}

const getSiteContent = asyncHandler(async (req, res) => {
  const content = await getOrCreateSiteContent();
  res.status(200).json({ data: content });
});

const updateSiteContent = asyncHandler(async (req, res) => {
  const content = await getOrCreateSiteContent();

  await content.update({
    fr: hasOwnProperty(req.body, 'fr') ? req.body.fr : content.fr,
    en: hasOwnProperty(req.body, 'en') ? req.body.en : content.en,
  });

  res.status(200).json({
    message: 'Site content updated successfully.',
    data: content,
  });
});

module.exports = {
  getSiteContent,
  updateSiteContent,
};