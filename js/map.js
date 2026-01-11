document.addEventListener('DOMContentLoaded', function () {
  if (typeof ymaps === 'undefined') {
    console.error('Yandex Maps API не загрузился');
    return;
  }

  ymaps.ready(init);

  function init() {
    const map = new ymaps.Map('yandex-map', {
      center: [55.76, 37.64], // Москва
      zoom: 11,
      controls: ['zoomControl', 'fullscreenControl']
    });

    const resources = [
      {
        name: "Языковая школа Lingua",
        type: "school",
        coords: [55.751244, 37.618423],
        address: "ул. Тверская, 1",
        hours: "9:00 – 18:00",
        contact: "+7 123 456-78-90",
        description: "Курсы английского и испанского языков"
      },
      {
        name: "Библиотека иностранных языков",
        type: "library",
        coords: [55.761244, 37.628423],
        address: "ул. Пушкина, 10",
        hours: "10:00 – 20:00",
        contact: "",
        description: "Книги и учебные материалы на иностранных языках"
      },
      {
        name: "Языковое кафе SpeakUp",
        type: "cafe",
        coords: [55.755, 37.615],
        address: "ул. Арбат, 12",
        hours: "12:00 – 23:00",
        contact: "+7 987 654-32-10",
        description: "Разговорные клубы и языковой обмен"
      }
    ];

    const placemarks = [];

    resources.forEach(r => {
      const placemark = new ymaps.Placemark(
        r.coords,
        {
          balloonContentHeader: `<strong>${r.name}</strong>`,
          balloonContentBody: `
            <b>Адрес:</b> ${r.address}<br>
            <b>Часы:</b> ${r.hours}<br>
            ${r.contact ? `<b>Контакт:</b> ${r.contact}<br>` : ''}
            <b>Описание:</b> ${r.description}
          `
        },
        {
          preset: 'islands#blueIcon'
        }
      );

      placemark.resourceType = r.type;
      map.geoObjects.add(placemark);
      placemarks.push(placemark);
    });

    // Фильтр
    const filter = document.getElementById('resource-type-filter');
    if (filter) {
      filter.addEventListener('change', () => {
        const value = filter.value;
        placemarks.forEach(pm => {
          pm.options.set('visible', !value || pm.resourceType === value);
        });
      });
    }
  }
});
