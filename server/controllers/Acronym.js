const models = require('../models');
const Acronym = models.Acronym;

const makerPage = async (req, res) => {
  return res.render('app');
};

const makeEntry = async (req, res) => {
    if(!req.body.acronym || !req.body.definition || !req.body.creator){
        return res.status(400).json({ error: 'Acronym, definition, and creator are required' });
    }

    const baseEntryData = {
        acronym: req.body.acronym,
        definition: req.body.definition,
        tags: req.body.tags,
        blacklist: req.body.blacklist,
        owner: req.session.account._id,
        creator: req.body.creator,
    };

    try{
        const newEntry = new Acronym(baseEntryData);
        await newEntry.save();
        return res.status(201).json({ acronym: newEntry.acronym, 
          definition: newEntry.definition, 
          tags: newEntry.tags, 
          blacklist: newEntry.blacklist,
          creator: newEntry.creator 
        });
    } catch (err) {
        console.log(err);
        if(err.code === 11000){
            return res.status(400).json({ error: 'Acronym already exists!' });
        }
        return res.status(400).json({ error: 'An error occurred making Acronym!' });
    }
};

const getEntries = async (req, res) => {
  try{
    const query = {owner: req.session.account._id};
    const docs = await Acronym.find(query).select('acronym definition tags blacklist creator').lean().exec();

    return res.json({ entries: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving Acronyms!' });
  }
};

module.exports = {
  makerPage,
  makeEntry,
  getEntries,
};