(function () {
  const valueEl = document.getElementById('pageVisitCount');
  const statusEl = document.getElementById('pageVisitStatus');

  if (!valueEl || !statusEl) {
    return;
  }

  const mqttLib = window.mqtt;
  if (!mqttLib) {
    valueEl.textContent = '--';
    statusEl.textContent = 'MQTT-Bibliothek fehlt';
    return;
  }

  // Wird einmal fest verdrahtet, damit alle Besucher denselben Zähler lesen.
  const COUNTER_TOPIC = 'a7d3b2f4-1f2b-4f7f-9c6f-8a1f7f2c8e11/inspace/counter';
  const BROKER_URL = 'wss://test.mosquitto.org:8081/mqtt';

  let currentCount = null;
  let incrementedThisVisit = false;
  let fallbackTimer = null;

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function renderCount(count) {
    valueEl.textContent = String(count);
  }

  function parseCount(payload) {
    const text = payload.toString().trim();
    const parsed = Number(text);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function publishNext(client, baseCount) {
    if (incrementedThisVisit) {
      return;
    }

    const nextCount = baseCount + 1;
    incrementedThisVisit = true;
    setStatus('Zähler aktiv');
    client.publish(COUNTER_TOPIC, String(nextCount), { retain: true }, (err) => {
      if (err) {
        incrementedThisVisit = false;
        setStatus('Zähler offline');
        return;
      }

      currentCount = nextCount;
      renderCount(nextCount);
    });
  }

  const clientId = `inspace_${Math.random().toString(16).slice(2, 10)}`;
  const client = mqttLib.connect(BROKER_URL, {
    clientId,
    clean: true,
    keepalive: 30,
    reconnectPeriod: 0,
    connectTimeout: 8000
  });

  setStatus('Verbinde ...');

  client.on('connect', () => {
    setStatus('Verbunden');
    client.subscribe(COUNTER_TOPIC, { qos: 0 }, (err) => {
      if (err) {
        setStatus('Abo fehlgeschlagen');
        return;
      }

      fallbackTimer = window.setTimeout(() => {
        publishNext(client, currentCount ?? 0);
      }, 1500);
    });
  });

  client.on('message', (topic, payload) => {
    if (topic !== COUNTER_TOPIC) {
      return;
    }

    const incoming = parseCount(payload);
    if (currentCount === null || incoming > currentCount) {
      currentCount = incoming;
      renderCount(currentCount);
    }

    if (!incrementedThisVisit) {
      publishNext(client, currentCount);
    }

    if (fallbackTimer) {
      window.clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }
  });

  client.on('error', () => {
    setStatus('Broker nicht erreichbar');
  });

  client.on('close', () => {
    if (!incrementedThisVisit) {
      setStatus('Nur lokale Anzeige');
    }
  });
})();
