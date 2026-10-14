document.addEventListener('DOMContentLoaded', () => {
  setupSmoothScrolling();
  setupScrollReveal();
  setupBackToTop();
});

/**
 * 1. التمرير السلس للروابط الداخلية
 */
function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      const targetId = this.getAttribute('href');
      
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

/**
 * 2. إظهار العناصر بشكل انسيابي أثناء التمرير (Scroll Reveal)
 */
function setupScrollReveal() {
  // يمكنك إضافة كلاس scroll-reveal لأي عنصر تريده أن يظهر بأنيميشن عند التمرير
  const targets = document.querySelectorAll('.service-card, .lecture-card, .motivational-banner, .news-panel');

  targets.forEach(el => el.classList.add('scroll-reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15 // يظهر الكارت بمجرد دخول 15% منه في الشاشة
  });

  targets.forEach(target => observer.observe(target));
}

/**
 * 3. إظهار وإخفاء زر العودة للأعلى
 */
function setupBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
document.addEventListener('DOMContentLoaded', () => {
  setupSmoothScrolling();
  setupScrollReveal();
  setupBackToTop();
  setupCopyLocation(); // تفعيل ميزة نسخ اللوكيشن
});

/**
 * ميزة نسخ رابط اللوكيشن وتغيير حالة الزر فورياً
 */
function setupCopyLocation() {
  const copyButtons = document.querySelectorAll('.copy-location-btn');

  copyButtons.forEach(button => {
    button.addEventListener('click', async function () {
      const locationUrl = this.getAttribute('data-location');

      if (!locationUrl) return;

      try {
        // نسخ الرابط إلى الحافظة (Clipboard)
        await navigator.clipboard.writeText(locationUrl);

        // حفظ المحتوى الأصلي للزر
        const originalText = this.querySelector('span').textContent;
        const originalIcon = this.querySelector('i').className;

        // تغيير الشكل لإظهار نجاح العملية
        this.classList.add('copied');
        this.querySelector('span').textContent = 'تم النسخ!';
        this.querySelector('i').className = 'fa-solid fa-check';

        // إعادة الزر إلى شكله الطبيعي بعد ثانيتين
        setTimeout(() => {
          this.classList.remove('copied');
          this.querySelector('span').textContent = originalText;
          this.querySelector('i').className = originalIcon;
        }, 2000);

      } catch (err) {
        console.error('فشل نسخ اللوكيشن:', err);
      }
    });
  });
}

function copyBonus(elementId, btn) {
  const element = document.getElementById(elementId);
  // استخراج النص فقط بدون وسم الـ HTML
  const textToCopy = element.innerText;

  navigator.clipboard.writeText(textToCopy).then(() => {
    const originalText = btn.innerHTML;
    btn.innerHTML = "✅ تم النسخ!";
    btn.style.backgroundColor = "#27ae60";

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.backgroundColor = "#2980b9";
    }, 2000);
  }).catch(err => {
    console.error('فشل النسخ: ', err);
  });
}

function copyZoneText(element) {
  // جلب النص المخصص المخزن داخل الـ data-copy
  const textToCopy = element.getAttribute('data-copy');

  navigator.clipboard.writeText(textToCopy).then(() => {
    // حفظ الشكل الأصلي للـ Tag
    const originalText = element.innerText;
    const originalBg = element.style.backgroundColor;

    // تغيير المظهر مؤقتاً لتأكيد النسخ
    element.innerText = "✅ تم النسخ";
    element.style.backgroundColor = "#10b981"; // لون أخضر نجاح
    element.style.color = "#ffffff";
    element.style.borderColor = "#10b981";

    // إرجاع الشكل الأصلي بعد ثانيتين
    setTimeout(() => {
      element.innerText = originalText;
      element.style.backgroundColor = originalBg;
      element.style.color = "";
      element.style.borderColor = "";
    }, 1500);

  }).catch(err => {
    console.error('فشل النسخ: ', err);
  });
}


// ==========================================================================
// 1. دالة حساب تاريخ الغد بتنسيق DD/MM/YYYY
// ==========================================================================
function getTomorrowFormatted() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const day = String(tomorrow.getDate()).padStart(2, '0');
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const year = tomorrow.getFullYear();
  return `${day}/${month}/${year}`;
}

// ==========================================================================
// 2. عند تحميل الصفحة: تعبئة تاريخ الغد وتثبيت التوجيهات
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const tomorrowStr = getTomorrowFormatted();
  
  // تحديث خانات تاريخ الغد في كافة الأقسام تلقائياً
  document.querySelectorAll('.tomorrow-date-display').forEach(el => {
    el.innerHTML = `<i class="fa-regular fa-calendar-check"></i> غداً: ${tomorrowStr}`;
  });

  // تهيئة شاشات استعلام المشرفين
  updateSupervisorGuide();
});

// ==========================================================================
// 3. التنقل بين أقسام المكاتب في الناف بار
// ==========================================================================
function switchInquiryTab(event, paneId) {
  const panes = document.querySelectorAll('.inquiry-content-pane');
  const navItems = document.querySelectorAll('.inquiry-nav-item');

  // إخفاء كل المحتويات وإلغاء تفعيل الأزرار
  panes.forEach(pane => pane.classList.remove('active'));
  navItems.forEach(item => item.classList.remove('active'));

  // تفعيل القسم والزر المختار
  document.getElementById(paneId).classList.add('active');
  event.currentTarget.classList.add('active');
}

// ==========================================================================
// 4. التحديث التلقائي لاسم مدير التشغيل حسب المنطقة المختارة
// ==========================================================================
function updateSupervisorGuide() {
  const regionSelect = document.getElementById('regionSelect');
  if (!regionSelect) return;

  const region = regionSelect.value;
  const managerVal = document.getElementById('dynamicManagerVal');
  const managerDesc = document.getElementById('dynamicManagerDesc');

  if (region === "معادي") {
    managerVal.textContent = "فؤاد";
    managerDesc.textContent = "مدير تشغيل المعادي ومدينه نصر والجيزه";
  } else if (region === "الشروق") {
    managerVal.textContent = "أحمد نوت";
    managerDesc.textContent = "مدير تشغيل الشروق ومدينتي";
  } else if (region === "طنطا") {
    managerVal.textContent = "علي حسن";
    managerDesc.textContent = "مدير تشغيل طنطا والمحله والمنصوره";
  } else {
    managerVal.textContent = "أحمد نبيل أو زياد";
    managerDesc.textContent = "مديرين تشغيل اكتوبر والشيخ زايد وبالم هيلز وتجمع";
  }
}