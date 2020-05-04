<template>
  <div class="page">
    <form @submit.prevent="showQuestion" style="width: 800px;margin: 0 auto;padding-top: 20px;">
      <div class="field">
        <label class="label">Question</label>
        <div class="control">
          <input type="text" class="input" v-model="question" />
        </div>
      </div>

      <div class="field" v-for="index in 4" :key="index + 10">
        <label class="label">Answer {{ numberToLetter(index - 1, true) }}</label>
        <div class="control">
          <input type="text" class="input" v-model="answers[numberToLetter(index - 1)].text" />
        </div>
      </div>

      <div class="field">
        <label class="label">Correct Answer</label>
        <div class="control">
          <div class="select">
            <select v-model="correctAnswer">
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
          </div>
        </div>
      </div>

      <div class="buttons has-addons">
        <button class="button is-primary">Display</button>
        <button class="button" type="button" @click="cgNext">Next</button>
        <button class="button is-danger" type="button" @click="questionHide">Hide</button>
      </div>

      <div class="buttons has-addons">
        <button
          v-for="(a, index) in answersArray"
          :key="index"
          class="button"
          type="button"
          :class="{'is-warning': a.selected}"
          @click="selectAnswer(index)"
          :disabled="a.hidden"
        >
          <b class="has-text-primary" style="margin-right:5px">{{ numberToLetter(index, true) }}:</b>
          {{ a.text }}
        </button>
        <button class="button is-danger" type="button" @click="clearSelection">Clear selection</button>
      </div>
      <div class="buttons has-addons">
        <button class="button" type="button" @click="fiftyFifty">50/50</button>
        <button class="button" type="button">Ask the audience</button>
        <button class="button" type="button">One more time</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      question: "",
      correctAnswer: "A",
      answers: {
        a: {
          text: "",
          selected: false,
          hidden: false
        },
        b: {
          text: "",
          selected: false,
          hidden: false
        },
        c: {
          text: "",
          selected: false,
          hidden: false
        },
        d: {
          text: "",
          selected: false,
          hidden: false
        }
      }
    };
  },
  methods: {
    showQuestion() {
      this.$socket.emit("showQuestion", this.questionUpdateObject);
    },
    cgNext() {
      this.$socket.emit("cgNext");
    },
    questionHide() {
      for (var i = 0; i < this.answersArray.length; i++) {
        this.answersArray[i].selected = false;
        this.answersArray[i].correct = false;
        this.answersArray[i].incorrect = false;
        this.answersArray[i].hidden = false;
      }

      this.$socket.emit("questionHide");
    },
    selectAnswer(index) {
      // If this happens, the answer is already selected
      if (this.answers[this.numberToLetter(index)].selected == true) {
        this.correctUpdate(index);
        return;
      }

      this.answers.a.selected = false;
      this.answers.b.selected = false;
      this.answers.c.selected = false;
      this.answers.d.selected = false;

      this.answers[this.numberToLetter(index)].selected = true;
      this.questionUpdate();
    },
    correctUpdate(index) {
      if (this.numberToLetter(index, true) == this.correctAnswer) {
        this.answerByIndex(index).correct = true;
        this.answerByIndex(index).selected = false;
      } else {
        this.answerByIndex(index).incorrect = true;
        this.answerByIndex(index).selected = false;

        this.answers[this.correctAnswer.toLowerCase()].correct = true;
      }

      this.questionUpdate();
    },
    numberToLetter(num, uppercase) {
      return String.fromCharCode(num + (uppercase ? 65 : 97));
    },
    questionUpdate() {
      this.$socket.emit("questionUpdate", this.questionUpdateObject);
    },
    answerByIndex(index) {
      return this.answers[this.numberToLetter(index)];
    },
    clearSelection() {
      if (this.answersArray.find(i => i.selected)) {
        this.answersArray.find(i => i.selected).selected = false;
      }

      this.questionUpdate();
    },
    fiftyFifty() {
      var incorrectAnswers = this.answersArray.filter((item, index) => {
        return this.numberToLetter(index, true) != this.correctAnswer;
      });
      var itemsToHide = incorrectAnswers
        .slice()
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      for (var i = 0; i < itemsToHide.length; i++) {
        itemsToHide[i].hidden = true;
      }
      this.questionUpdate();
    }
  },
  computed: {
    questionUpdateObject() {
      return {
        question: {
          text: this.question
        },
        answerA: this.answers.a,
        answerB: this.answers.b,
        answerC: this.answers.c,
        answerD: this.answers.d
      };
    },
    answersArray() {
      return Object.values(this.answers);
    }
  }
};
</script>