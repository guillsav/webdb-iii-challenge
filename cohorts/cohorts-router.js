const express = require('express');
const knex = require('knex');

const KnexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.db3'
  },
  useNullAsDefault: true
};

const db = knex(KnexConfig);

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    if (req.body.name.length > 0) {
      const newCohort = await db('cohorts').insert(req.body);
      res.status(201).json(newCohort);
    } else {
      res.status(400).json({message: 'Please provide a name to add a cohort.'});
    }
  } catch (error) {
    res
      .status(500)
      .json({errorMessage: 'Error while adding a cohort in the database.'});
  }
});

router.get('/', async (req, res) => {
  try {
    const cohorts = await db('cohorts');
    res.status(200).json(cohorts);
  } catch (error) {
    res.status(500).json({
      errorMessage: 'Error while retrieving the cohorts from the database.'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cohort = await db('cohorts')
      .where({id: req.params.id})
      .first();
    if (cohort) {
      res.status(200).json(cohort);
    } else {
      res
        .status(404)
        .json({message: `Cohort with ID ${req.params.id} doesn't exist. `});
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: 'Error while retrieving the cohort from the database.'
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (req.body.name.length > 0) {
      const editedCohort = await db('cohorts')
        .where({id: req.params.id})
        .first()
        .update(req.body);

      if (editedCohort) {
        res.status(200).json(editedCohort);
      } else {
        res
          .status(404)
          .json({message: `Cohort with ID ${req.params.id} doesn't exist.`});
      }
    } else {
      res
        .status(400)
        .json({message: 'Please provide a name to edit a cohort.'});
    }
  } catch (error) {
    res.status(500).json({
      errorMessage:
        'Error while updating the cohort information in the database.'
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedCohort = await db('cohorts')
      .where({id: req.params.id})
      .delete(req.body);
    if (!deletedCohort) {
      res
        .status(404)
        .json({message: `Cohort with ID ${req.params.id} doesn't exist.`});
    } else {
      res.status(204).end();
    }
  } catch (error) {
    res
      .status(500)
      .json({
        errorMessage: 'Error while deleting the cohort from the database.'
      });
  }
});

module.exports = router;
