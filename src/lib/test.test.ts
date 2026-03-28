import assert from "node:assert/strict";
import test from "node:test";
import { QUESTIONS, categoryLabel, evaluateAnswers } from "./test";

test("evaluateAnswers returns perfect score for all correct answers", () => {
  const answers = QUESTIONS.map((q) => q.correctIndex);
  const result = evaluateAnswers(answers);

  assert.equal(result.totalCorrect, QUESTIONS.length);
  assert.equal(result.totalQuestions, QUESTIONS.length);
  assert.equal(result.estimatedIq, 145);
  assert.equal(result.percentile, 98);
});

test("evaluateAnswers handles all wrong answers", () => {
  const answers = QUESTIONS.map((q) => (q.correctIndex + 1) % 4);
  const result = evaluateAnswers(answers);

  assert.equal(result.totalCorrect, 0);
  assert.equal(result.totalQuestions, QUESTIONS.length);
  assert.equal(result.estimatedIq, 70);
  assert.equal(result.percentile, 5);
});

test("category labels are localized", () => {
  assert.equal(categoryLabel("en", "memory"), "Memory");
  assert.equal(categoryLabel("it", "memory"), "Memoria");
  assert.equal(categoryLabel("de", "spatial"), "Raumlich");
});
