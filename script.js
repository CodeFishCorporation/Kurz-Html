document.addEventListener('DOMContentLoaded', function() {
  // Конфигурация правильных ответов
  const correctAnswers = {
    'week1': { q1: 'q1a2' },
    'week2': { q1: 'q2a1' },
    'week3': { q1: 'q3a2' },
    'week4': { q1: 'q4a1' }
  };

  // Инициализация аккордеона
  const accordionBtns = document.querySelectorAll('.accordion-btn');
  accordionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      this.classList.toggle('active');
      const content = this.nextElementSibling;
      content.classList.toggle('active');
    });
  });

  // Инициализация навигации
   document.querySelectorAll('.weeks-nav-floating button').forEach(btn => {
  btn.addEventListener('click', function() {
    const weekId = this.dataset.goto;
    const target = document.getElementById(weekId);
    if (target) {
      const rect = target.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetY = rect.top + scrollTop - (window.innerHeight / 2) + (rect.height / 2);
      window.scrollTo({ top: targetY, behavior: 'smooth' });

      // Эффект мигания
      target.classList.add('flash-highlight');
      setTimeout(() => target.classList.remove('flash-highlight'), 500);
    }
  });
});

  // Кнопки завершения недели
  const completeBtns = document.querySelectorAll('.complete-btn');
  const progressBar = document.getElementById('progress');
  const progressText = document.getElementById('progressText');
  let completedWeeks = 0;
  const totalWeeks = document.querySelectorAll('.accordion-item').length;

  // Проверка ответов в тестах
  document.querySelectorAll('.quiz-submit').forEach(btn => {
    btn.addEventListener('click', function() {
      const quiz = this.closest('.quiz');
      const weekItem = quiz.closest('.accordion-item');
      const weekId = weekItem.querySelector('.accordion-btn').dataset.week;
      
      let allCorrect = true;
      const questions = quiz.querySelectorAll('.quiz-question');
      
      questions.forEach((question, index) => {
        const questionNumber = `q${index + 1}`;
        const selectedOption = quiz.querySelector(`input[name="${questionNumber}"]:checked`);
        const correctAnswerId = correctAnswers[weekId]?.[questionNumber];
        
        if (!selectedOption || selectedOption.id !== correctAnswerId) {
          allCorrect = false;
          question.classList.add('incorrect');
          setTimeout(() => question.classList.remove('incorrect'), 1000);
        }
      });
      
      if (allCorrect) {
        alert('✅ Все ответы правильные! Отличная работа!');
      } else {
        alert('❌ Есть ошибки. Проверьте свои ответы и попробуйте снова!');
      }
    });
  });

  // Обработчики для промежуточных блоков
  document.querySelectorAll('.show-answer').forEach(btn => {
    btn.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      answer.classList.toggle('hidden');
      this.textContent = answer.classList.contains('hidden') ? 'Показать ответ' : 'Скрыть ответ';
    });
  });

  // Проверка экзамена
  const examSubmitBtn = document.querySelector('.exam-submit');
  if (examSubmitBtn) {
    examSubmitBtn.addEventListener('click', function() {
      const examQuestions = document.querySelectorAll('.exam-question');
      let score = 0;
      const correctAnswers = ['head', 'main', 'th', 'viewport'];
      
      examQuestions.forEach((question, index) => {
        const select = question.querySelector('.exam-select');
        if (select.value === correctAnswers[index]) {
          score++;
          question.classList.add('correct');
          question.classList.remove('incorrect');
        } else {
          question.classList.add('incorrect');
          question.classList.remove('correct');
        }
      });
      
      const resultElement = document.querySelector('.exam-result');
      if (score >= 3) {
        resultElement.innerHTML = `
          <h4>Ваш результат: ${score}/4</h4>
          <p>✅ Вы прошли тест! Теперь приступайте к финальному проекту.</p>
        `;
        document.querySelector('.final-project').style.display = 'block';
      } else {
        resultElement.innerHTML = `
          <h4>Ваш результат: ${score}/4</h4>
          <p>😢 Попробуйте еще раз! Нужно правильно ответить минимум на 3 вопроса.</p>
        `;
      }
      resultElement.classList.remove('hidden');
    });
  }

  // Функция проверки доступности экзамена
  function checkExamAvailability() {
    const completedWeeks = document.querySelectorAll('.accordion-item.completed').length;
    const examNav = document.getElementById('examNav');
    
    if (completedWeeks === totalWeeks) {
      document.getElementById('finalExam').classList.remove('hidden');
      examNav?.classList.remove('hidden');
    } else {
      document.getElementById('finalExam').classList.add('hidden');
      examNav?.classList.add('hidden');
    }
  }

  // Инициализация кнопок завершения недели
  completeBtns.forEach(btn => {
    const weekItem = btn.closest('.accordion-item');
    const weekNumber = btn.dataset.week;
    const isCompleted = localStorage.getItem(`week_${weekNumber}_completed`) === 'true';
    
    if (isCompleted) {
      weekItem.classList.add('completed');
      btn.classList.add('completed');
      btn.textContent = ' Неделя пройдена';
      completedWeeks++;
    }
    
    updateProgress();

    btn.addEventListener('click', function() {
      const weekItem = this.closest('.accordion-item');
      const weekNumber = this.dataset.week;
      const isCompleted = weekItem.classList.contains('completed');
      
      if (isCompleted) {
        weekItem.classList.remove('completed');
        this.classList.remove('completed');
        this.textContent = 'Отметить неделю как пройденную';
        completedWeeks--;
        localStorage.setItem(`week_${weekNumber}_completed`, 'false');
      } else {
        weekItem.classList.add('completed');
        this.classList.add('completed');
        this.textContent = ' Неделя пройдена';
        completedWeeks++;
        localStorage.setItem(`week_${weekNumber}_completed`, 'true');
      }
      
      updateProgress();
      checkExamAvailability();
    });
  });

  // После показа финального проекта показываем кнопку "Перейти к CSS"
  const finalProjectBlock = document.querySelector('.final-project');
  const goToCssBtn = document.getElementById('goToCssBtn');
  if (finalProjectBlock && goToCssBtn) {
    const observer = new MutationObserver(() => {
      if (finalProjectBlock.style.display === 'block') {
        goToCssBtn.classList.remove('hidden');
      } else {
        goToCssBtn.classList.add('hidden');
      }
    });
    observer.observe(finalProjectBlock, { attributes: true, attributeFilter: ['style'] });

    goToCssBtn.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }

  // Обновление прогресса
  function updateProgress() {
    const progressPercentage = Math.round((completedWeeks / totalWeeks) * 100);
    progressBar.style.width = `${progressPercentage}%`;
    progressText.textContent = `Прогресс: ${progressPercentage}%`;
    localStorage.setItem('courseProgress', progressPercentage);
  }

  // Восстановление прогресса
  function loadProgress() {
  const savedProgress = localStorage.getItem('courseProgress');
  if (savedProgress) {
    progressBar.style.width = `${savedProgress}%`;
    progressText.textContent = `Прогресс: ${savedProgress}%`;
  }
  checkExamAvailability();
  }
  document.getElementById('scrollTopBtn').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Инициализация при загрузке
  loadProgress();
});
