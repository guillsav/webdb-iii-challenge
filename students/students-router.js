const express = require('express');
const knex = require('knex');
const knexConfig = require('../knexfile.js');

const db = knex(knexConfig.development);

const checkCohortsId = (req, res, next) => {
  if (req.body.cohort_id === '' || !req.body.cohort_id) {
    res.status(400).json({message: 'Please provide a cohort ID'});
  } else {
    const foundCohort = db('cohorts')
      .where({id: req.body.cohort_id})
      .first()
      .then(cohort => {
        if (cohort) {
          next();
        } else {
          res.status(404).json({
            errorMessage: `Cohort ID ${
              req.body.cohort_id
            } doesn't exist, please provide a valid cohort ID.`
          });
        }
      })
      .catch(err => console.log(err));
  }
};

const router = express.Router();

router.post('/', checkCohortsId, async (req, res) => {
  try {
    if (req.body.name.length > 0) {
      const newStudent = await db('students').insert(req.body);
      res.status(201).json(newStudent);
    } else {
      res
        .status(400)
        .json({message: 'Please provide a name to add a student.'});
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: 'Error while addign a the student to the database.'
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const students = await db('students');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      errorMessage: 'Error while retrieving the students from the database.'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const foundStudent = await db('students')
      .where({id: req.params.id})
      .first();
    if (foundStudent) {
      res.status(200).json(foundStudent);
    } else {
      res
        .status(404)
        .json({message: `Student with ID ${req.params.id} doesn't exist.`});
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: 'Error while retrieving the student from the database.'
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (req.body.name.length > 0) {
      const editedStudent = await db('students')
        .where({id: req.params.id})
        .update(req.body);

      if (editedStudent) {
        res.status(200).json(editedStudent);
      } else {
        res
          .status(404)
          .json({message: `No student with ID of ${req.params.id} was found.`});
      }
    } else {
      res.status(400).json({message: 'Please provide a name!'});
    }
  } catch (error) {
    res
      .status(500)
      .json({errorMessage: 'Error while updating the student informations.'});
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedStudent = await db('students')
      .where({id: req.params.id})
      .delete(req.body);
    if (deletedStudent) {
      res.status(204).end();
    } else {
      res
        .status(404)
        .json({message: `No student with ID of ${req.params.id} was found.`});
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: 'Error while deleting the student from the database.'
    });
  }
});

module.exports = router;
