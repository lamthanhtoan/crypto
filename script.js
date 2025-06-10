const coins = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', binanceSymbol: 'BTCUSDT', coinbaseSymbol: 'BTC-USD', krakenSymbol: 'XBTUSD' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', binanceSymbol: 'ETHUSDT', coinbaseSymbol: 'ETH-USD', krakenSymbol: 'ETHUSD' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', binanceSymbol: 'BNBUSDT', coinbaseSymbol: 'BNB-USD', krakenSymbol: null },
  { id: 'solana', symbol: 'SOL', name: 'Solana', binanceSymbol: 'SOLUSDT', coinbaseSymbol: 'SOL-USD', krakenSymbol: 'SOLUSD' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', binanceSymbol: 'XRPUSDT', coinbaseSymbol: 'XRP-USD', krakenSymbol: 'XRPUSD' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', binanceSymbol: 'ADAUSDT', coinbaseSymbol: 'ADA-USD', krakenSymbol: 'ADAUSD' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', binanceSymbol: 'DOGEUSDT', coinbaseSymbol: 'DOGE-USD', krakenSymbol: 'DOGEUSD' },
  { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', binanceSymbol: 'SHIBUSDT', coinbaseSymbol: 'SHIB-USD', krakenSymbol: 'SHIBUSD' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', binanceSymbol: 'AVAXUSDT', coinbaseSymbol: 'AVAX-USD', krakenSymbol: 'AVAXUSD' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', binanceSymbol: 'DOTUSDT', coinbaseSymbol: 'DOT-USD', krakenSymbol: 'DOTUSD' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', binanceSymbol: 'LINKUSDT', coinbaseSymbol: 'LINK-USD', krakenSymbol: 'LINKUSD' },
  { id: 'tron', symbol: 'TRX', name: 'Tron', binanceSymbol: 'TRXUSDT', coinbaseSymbol: 'TRX-USD', krakenSymbol: 'TRXUSD' },
  { id: 'matic-network', symbol: 'MATIC', name: 'Polygon', binanceSymbol: 'MATICUSDT', coinbaseSymbol: 'MATIC-USD', krakenSymbol: 'MATICUSD' },
  { id: 'near', symbol: 'NEAR', name: 'Near Protocol', binanceSymbol: 'NEARUSDT', coinbaseSymbol: 'NEAR-USD', krakenSymbol: 'NEARUSD' },
  { id: 'aptos', symbol: 'APT', name: 'Aptos', binanceSymbol: 'APTUSDT', coinbaseSymbol: 'APT-USD', krakenSymbol: 'APTUSD' },
  { id: 'stellar', symbol: 'XLM', name: 'Stellar', binanceSymbol: 'XLMUSDT', coinbaseSymbol: 'XLM-USD', krakenSymbol: 'XLMUSD' },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos', binanceSymbol: 'ATOMUSDT', coinbaseSymbol: 'ATOM-USD', krakenSymbol: 'ATOMUSD' },
  { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', binanceSymbol: 'ARBUSDT', coinbaseSymbol: 'ARB-USD', krakenSymbol: 'ARBUSD' },
  { id: 'optimism', symbol: 'OP', name: 'Optimism', binanceSymbol: 'OPUSDT', coinbaseSymbol: 'OP-USD', krakenSymbol: 'OPUSD' },
  { id: 'hedera-hashgraph', symbol: 'HBAR', name: 'Hedera', binanceSymbol: 'HBARUSDT', coinbaseSymbol: 'HBAR-USD', krakenSymbol: 'HBARUSD' }
];

let currentCoin = coins.find(coin => coin.id === 'bitcoin');
let predictionHistory = [];
let wsTicker = null;
let wsCandlestick = null;
let chart = null;
let candlestickSeries = null;
let currentPrice = 103423.35;
let isLoggedIn = false;

const mockPriceData = {
  bitcoin: [
    { ds: "2025-06-05T17:00:00Z", y: 70000 }, { ds: "2025-06-05T18:00:00Z", y: 70100 },
    { ds: "2025-06-05T19:00:00Z", y: 69900 }, { ds: "2025-06-05T20:00:00Z", y: 70200 },
    { ds: "2025-06-05T23:00:00Z", y: 70300 }, { ds: "2025-06-06T00:19:00Z", y: 103423.35 }
  ],
  ethereum: [
    { ds: "2025-06-05T17:00:00Z", y: 3650 }, { ds: "2025-06-05T18:00:00Z", y: 3660 },
    { ds: "2025-06-05T19:00:00Z", y: 3640 }, { ds: "2025-06-05T20:00:00Z", y: 3670 },
    { ds: "2025-06-05T23:00:00Z", y: 3680 }, { ds: "2025-06-06T00:19:00Z", y: 3690 }
  ]
};

const mockCandlestickData = {
  bitcoin: [
    { time: 1717618800, open: 70000, high: 70100, low: 69900, close: 70050 },
    { time: 1717619400, open: 70050, high: 70200, low: 70000, close: 70150 },
    { time: 1717620600, open: 70150, high: 103500, low: 70000, close: 103423.35 }
  ]
};

function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function showAuthModal(isRegister = false) {
  if (isRegister) {
    document.getElementById('register-modal').classList.remove('hidden');
  } else {
    document.getElementById('auth-modal').classList.remove('hidden');
  }
}

function hideAuthModal() {
  document.getElementById('auth-modal').classList.add('hidden');
  document.getElementById('auth-form').reset();
}

function hideRegisterModal() {
  document.getElementById('register-modal').classList.add('hidden');
  document.getElementById('register-form').reset();
}

function togglePasswordVisibility(inputId) {
  const passwordInput = document.getElementById(inputId);
  const toggleButton = document.getElementById(`toggle-${inputId}`);
  if (passwordInput && toggleButton) {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    toggleButton.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
  }
}

function updateUserInterface() {
  const username = localStorage.getItem('currentUser');
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const user = users[username];
  if (isLoggedIn && user) {
    document.getElementById('user-greeting').classList.remove('hidden');
    document.getElementById('user-name-display').textContent = `Chào ${user.fullName || username}`;
    document.getElementById('user-avatar').src = user.avatar || 'https://via.placeholder.com/32';
    document.getElementById('auth-button').classList.add('hidden');
    document.getElementById('logout-button').classList.remove('hidden');
    document.getElementById('menu-section').classList.remove('hidden');
  } else {
    document.getElementById('user-greeting').classList.add('hidden');
    document.getElementById('auth-button').classList.remove('hidden');
    document.getElementById('logout-button').classList.add('hidden');
    document.getElementById('menu-section').classList.add('hidden');
    document.getElementById('menu-dropdown').classList.add('hidden');
  }
}

function handleAuth(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (!username || !password) {
    alert('Vui lòng điền đầy đủ thông tin!');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[username] && users[username].password === password) {
    isLoggedIn = true;
    localStorage.setItem('currentUser', username);
    hideAuthModal();
    updateUserInterface();
    alert('Đăng nhập thành công!');
  } else {
    alert('Tên đăng nhập hoặc mật khẩu sai!');
  }
}

function handleRegister(event) {
  event.preventDefault();
  const username = document.getElementById('register-username').value;
  const fullName = document.getElementById('user-name').value;
  const email = document.getElementById('register-email').value;
  const referralCode = document.getElementById('referral-code').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const terms = document.getElementById('terms').checked;

  if (!username || !fullName || !email || !password || !confirmPassword || !terms) {
    alert('Vui lòng điền đầy đủ thông tin bắt buộc và đồng ý với điều khoản!');
    return;
  }

  if (password !== confirmPassword) {
    alert('Mật khẩu xác nhận không khớp!');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[username]) {
    alert('Tên đăng nhập đã tồn tại!');
    return;
  }

  if (referralCode) {
    let referralValid = false;
    for (let user in users) {
      if (users[user].ownReferralCode === referralCode) {
        referralValid = true;
        break;
      }
    }
    if (!referralValid) {
      alert('Mã giới thiệu không hợp lệ!');
      return;
    }
  }

  const newReferralCode = generateReferralCode();
  users[username] = { password, fullName, email, referralCode, ownReferralCode: newReferralCode, avatar: 'https://via.placeholder.com/128' };
  localStorage.setItem('users', JSON.stringify(users));
  alert(`Đăng ký thành công! Mã giới thiệu của bạn: ${newReferralCode}`);
  hideRegisterModal();
  showAuthModal(false);
}

function logout() {
  isLoggedIn = false;
  localStorage.removeItem('currentUser');
  updateUserInterface();
  window.location.href = 'index.html';
}

async function fetchPriceFromBinance(coinId) {
  const url = `https://api.binance.com/api/v3/klines?symbol=${coins.find(c => c.id === coinId)?.binanceSymbol}&interval=1h&limit=168`;
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('Lỗi mạng Binance');
    const data = await response.json();
    return data.map(([timestamp, , , , close]) => ({
      ds: new Date(parseInt(timestamp)).toISOString(),
      y: parseFloat(close)
    }));
  } catch (error) {
    console.error(`Lỗi Binance ${coinId}:`, error);
    return null;
  }
}

async function fetchPriceFromCoinbase(coinId) {
  const symbol = coins.find(c => c.id === coinId)?.coinbaseSymbol;
  if (!symbol) return null;
  const url = `https://api.pro.coinbase.com/products/${symbol}/candles?granularity=3600`;
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('Lỗi mạng Coinbase');
    const data = await response.json();
    return data.map(([timestamp, , , , close]) => ({
      ds: new Date(timestamp * 1000).toISOString(),
      y: parseFloat(close)
    })).reverse();
  } catch (error) {
    console.error(`Lỗi Coinbase ${coinId}:`, error);
    return null;
  }
}

async function fetchPriceFromKraken(coinId) {
  const symbol = coins.find(c => c.id === coinId)?.krakenSymbol;
  if (!symbol) return null;
  const url = `https://api.kraken.com/0/public/OHLC?pair=${encodeURIComponent(symbol)}&interval=60`;
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('Lỗi mạng Kraken');
    const data = await response.json();
    const pairData = data.result[symbol];
    if (!pairData) throw new Error('Dữ liệu Kraken không hợp lệ');
    return pairData.map(([timestamp, , , , close]) => ({
      ds: new Date(timestamp * 1000).toISOString(),
      y: parseFloat(close)
    }));
  } catch (error) {
    console.error(`Lỗi Kraken ${coinId}:`, error);
    return null;
  }
}

async function fetchPriceData(coinId) {
  const cacheKey = `price_${coinId}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const data = JSON.parse(cached);
    if (Date.now() - data.timestamp < 300000) return data.prices;
  }
  const [binanceData, coinbaseData, krakenData] = await Promise.all([
    fetchPriceFromBinance(coinId),
    fetchPriceFromCoinbase(coinId),
    fetchPriceFromKraken(coinId)
  ]);
  let prices = binanceData || coinbaseData || krakenData || mockPriceData[coinId] || mockPriceData.bitcoin;
  if (prices) {
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), prices }));
  }
  return prices;
}

function linearRegressionFallback(data) {
  const times = data.map((_, i) => i);
  const prices = data.map(d => d.y);
  const n = times.length;
  if (n < 2) return prices[prices.length - 1] || currentPrice || 0;
  const xMean = times.reduce((a, b) => a + b, 0) / n;
  const yMean = prices.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (times[i] - xMean) * (prices[i] - yMean);
    den += (times[i] - xMean) ** 2;
  }
  return den === 0 ? (prices[prices.length - 1] || currentPrice || 0) : yMean + (num / den) * (n + 24);
}

async function predictPrice(data) {
  try {
    const model = new Prophet({
      growth: 'linear',
      seasonality_mode: 'additive',
      yearly_seasonality: false
    });
    await model.fit(data);
    const future = model.make_future_dataframe({ periods: 24, freq: 'H' });
    const forecast = await model.predict(future);
    const predictedPrice = forecast.yhat[forecast.yhat.length - 1];
    return isNaN(predictedPrice) || predictedPrice <= 0 ? linearRegressionFallback(data) : predictedPrice;
  } catch (error) {
    console.error('Lỗi dự đoán Prophet:', error);
    return linearRegressionFallback(data);
  }
}

async function updateCoin() {
  if (!currentCoin) return;
  try {
    const data = await fetchPriceData(currentCoin.id);
    if (!data || data.some(d => isNaN(d.y) || d.y <= 0)) throw new Error('Dữ liệu không hợp lệ');
    const predictedPrice = await predictPrice(data);
    const lastPrice = data[data.length - 1].y;
    const trend = predictedPrice > lastPrice ? 'Tăng' : 'Giảm';
    const percentageChange = ((predictedPrice - lastPrice) / lastPrice) * 100;

    document.getElementById('predicted-price').textContent = `$${predictedPrice.toFixed(2)}`;
    document.getElementById('trend').textContent = `${trend} (${percentageChange.toFixed(2)}%)`;

    predictionHistory.unshift({
      time: new Date().toLocaleString('vi-VN'),
      price: predictedPrice.toFixed(2),
      trend: `${trend} (${percentageChange.toFixed(2)}%)`
    });
    if (predictionHistory.length > 10) predictionHistory.pop();

    document.getElementById('prediction-history').innerHTML = predictionHistory.map(item =>
      `<li class="py-1">${item.time}: $${item.price} - ${item.trend}</li>`
    ).join('');
  } catch (error) {
    console.error(`Lỗi updateCoin ${currentCoin.id}:`, error);
    document.getElementById('predicted-price').textContent = 'Dữ liệu tạm thời không khả dụng';
    document.getElementById('trend').textContent = 'Dữ liệu tạm thời không khả dụng';
  }
}

function updateCurrentPrice() {
  if (!currentCoin) return;
  if (wsTicker) wsTicker.close();
  wsTicker = new WebSocket(`wss://stream.binance.com:9443/ws/${currentCoin.binanceSymbol.toLowerCase()}@ticker`);
  let retryCount = 0;
  const maxRetries = 3;
  let lastPrice = currentPrice;
  let currentCandlestick = null;

  wsTicker.onopen = () => {
    document.getElementById('current-price').textContent = 'Đang tải...';
    retryCount = 0;
  };
  wsTicker.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      currentPrice = parseFloat(data.c);
      if (!isNaN(currentPrice) && currentPrice > 0) {
        document.getElementById('current-price').textContent = `$${currentPrice.toFixed(2)}`;
        const currentTime = Math.floor(Date.now() / 1000 / 60) * 60;
        if (!currentCandlestick || currentCandlestick.time !== currentTime) {
          currentCandlestick = {
            time: currentTime,
            open: lastPrice || currentPrice,
            high: currentPrice,
            low: currentPrice,
            close: currentPrice
          };
        } else {
          currentCandlestick.high = Math.max(currentCandlestick.high, currentPrice);
          currentCandlestick.low = Math.min(currentCandlestick.low, currentPrice);
          currentCandlestick.close = currentPrice;
        }
        candlestickSeries.update(currentCandlestick);

        const cacheKey = `candlestick_${currentCoin.id}`;
        let cached = JSON.parse(localStorage.getItem(cacheKey)) || { timestamp: Date.now(), candles: [] };
        cached.candles.push(currentCandlestick);
        if (cached.candles.length > 60) cached.candles.shift();
        localStorage.setItem(cacheKey, JSON.stringify(cached));

        lastPrice = currentPrice;
      } else {
        currentPrice = 103423.35;
        document.getElementById('current-price').textContent = `$${currentPrice.toFixed(2)}`;
      }
    } catch (error) {
      console.error('Lỗi WebSocket ticker:', error);
      currentPrice = 103423.35;
      document.getElementById('current-price').textContent = `$${currentPrice.toFixed(2)}`;
      if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(() => wsTicker.close(), 1000);
      }
    }
  };
  wsTicker.onerror = () => {
    currentPrice = 103423.35;
    document.getElementById('current-price').textContent = `$${currentPrice.toFixed(2)}`;
    if (retryCount < maxRetries) {
      retryCount++;
      setTimeout(() => wsTicker.close(), 1000);
    }
  };
  wsTicker.onclose = () => {
    if (retryCount < maxRetries) {
      setTimeout(updateCurrentPrice, 5000);
    } else {
      fetchFallbackPrice();
    }
  };

  async function fetchFallbackPrice() {
    const url = `https://api.binance.com/api/v3/ticker/price?symbol=${currentCoin.binanceSymbol}`;
    try {
      const response = await fetch(url, { mode: 'cors' });
      const data = await response.json();
      currentPrice = parseFloat(data.price) || 103423.35;
      document.getElementById('current-price').textContent = `$${currentPrice.toFixed(2)}`;
    } catch (error) {
      console.error('Lỗi fallback price:', error);
      currentPrice = 103423.35;
      document.getElementById('current-price').textContent = `$${currentPrice.toFixed(2)}`;
    }
  }
}

async function initChart() {
  const chartContainer = document.getElementById('candlestick-chart');
  if (!chartContainer) return;
  chart = LightweightCharts.createChart(chartContainer, {
    width: chartContainer.offsetWidth,
    height: 192,
    layout: { background: { color: '#1f2937' }, textColor: '#d1d5db' },
    grid: { vertLines: { color: '#374151' }, horzLines: { color: '#374151' } },
    timeScale: { timeVisible: true, secondsVisible: false }
  });
  candlestickSeries = chart.addCandlestickSeries({
    upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
    wickUpColor: '#26a69a', wickDownColor: '#ef5350'
  });
  await loadInitialCandlestickData();
}

async function loadInitialCandlestickData() {
  const cacheKey = `candlestick_${currentCoin.id}`;
  let initialData = JSON.parse(localStorage.getItem(cacheKey))?.candles || [];
  if (initialData.length < 2 || Date.now() - (JSON.parse(localStorage.getItem(cacheKey))?.timestamp || 0) > 300000) {
    const url = `https://api.binance.com/api/v3/klines?symbol=${currentCoin.binanceSymbol}&interval=1m&limit=60`;
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) throw new Error('Lỗi mạng Binance');
      const data = await response.json();
      initialData = data.map(([time, open, high, low, close]) => ({
        time: parseInt(time) / 1000,
        open: parseFloat(open), high: parseFloat(high),
        low: parseFloat(low), close: parseFloat(close)
      }));
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), candles: initialData }));
    } catch (error) {
      console.error(`Lỗi loadInitialCandlestickData ${currentCoin.id}:`, error);
      initialData = mockCandlestickData[currentCoin.id] || mockCandlestickData.bitcoin;
      if (currentPrice) {
        initialData[initialData.length - 1].close = currentPrice;
        initialData[initialData.length - 1].open = currentPrice - 500;
        initialData[initialData.length - 1].high = currentPrice + 1000;
        initialData[initialData.length - 1].low = currentPrice - 1000;
      }
    }
  }
  if (candlestickSeries) candlestickSeries.setData(initialData);
}

function updateCandlestickData() {
  if (!currentCoin || !candlestickSeries) return;
  if (wsCandlestick) wsCandlestick.close();
  wsCandlestick = new WebSocket(`wss://stream.binance.com:9443/ws/${currentCoin.binanceSymbol.toLowerCase()}@kline_1m`);
  let retryCount = 0;
  const maxRetries = 3;
  wsCandlestick.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const kline = data.k;
      if (kline && kline.x) {
        const candlestick = {
          time: kline.t / 1000,
          open: parseFloat(kline.o),
          high: parseFloat(kline.h),
          low: parseFloat(kline.l),
          close: parseFloat(kline.c)
        };
        candlestickSeries.update(candlestick);
        const cacheKey = `candlestick_${currentCoin.id}`;
        let cached = JSON.parse(localStorage.getItem(cacheKey)) || { timestamp: Date.now(), candles: [] };
        cached.candles.push(candlestick);
        if (cached.candles.length > 60) cached.candles.shift();
        localStorage.setItem(cacheKey, JSON.stringify(cached));
      }
    } catch (error) {
      console.error('Lỗi WebSocket candlestick:', error);
    }
  };
  wsCandlestick.onclose = () => {
    if (retryCount < maxRetries) {
      retryCount++;
      setTimeout(updateCandlestickData, 5000);
    }
  };
}

function changeCoin() {
  const selector = document.getElementById('coin-selector');
  const coinId = selector.value;
  currentCoin = coins.find(coin => coin.id === coinId);
  if (currentCoin) {
    document.getElementById('coin-data').style.display = 'block';
    document.getElementById('coin-name').textContent = `${currentCoin.name} (${currentCoin.symbol})`;
    predictionHistory = [];
    document.getElementById('prediction-history').innerHTML = '';
    if (candlestickSeries) candlestickSeries.setData([]);
    loadInitialCandlestickData();
    updateCandlestickData();
    updateCoin();
    updateCurrentPrice();
  } else {
    document.getElementById('coin-data').style.display = 'none';
  }
}

function showTermsModal() {
  document.getElementById('terms-modal').classList.remove('hidden');
}

function hideTermsModal() {
  document.getElementById('terms-modal').classList.add('hidden');
}

function showUpgradeAccount() {
  document.getElementById('upgrade-account-modal').classList.remove('hidden');
}

function hideUpgradeAccount() {
  document.getElementById('upgrade-account-modal').classList.add('hidden');
}

function updateAvatar(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const username = localStorage.getItem('currentUser');
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      if (users[username]) {
        users[username].avatar = e.target.result;
        localStorage.setItem('users', JSON.stringify(users));
        document.getElementById('account-avatar').src = e.target.result;
        document.getElementById('user-avatar').src = e.target.result;
        alert('Đã cập nhật avatar!');
      }
    };
    reader.readAsDataURL(file);
  }
}

function loadAccountInfo() {
  const username = localStorage.getItem('currentUser');
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const user = users[username];
  if (user && document.getElementById('account-username')) {
    document.getElementById('account-username').value = username || '';
    document.getElementById('account-fullname').value = user.fullName || '';
    document.getElementById('account-email').value = user.email || '';
    document.getElementById('account-referral').value = user.ownReferralCode || 'Không có';
    document.getElementById('account-avatar').src = user.avatar || 'https://via.placeholder.com/128';
    document.getElementById('user-avatar').src = user.avatar || 'https://via.placeholder.com/32';
  } else if (!isLoggedIn) {
    window.location.href = 'index.html';
  }
}

function saveFullName() {
  const username = localStorage.getItem('currentUser');
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const newFullName = document.getElementById('account-fullname').value.trim();
  if (users[username] && newFullName) {
    users[username].fullName = newFullName;
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('user-name-display').textContent = `Chào ${newFullName}`;
    alert('Đã cập nhật tên người dùng!');
  } else {
    alert('Vui lòng nhập tên người dùng!');
  }
}

function copyReferralCode() {
  const referralCode = document.getElementById('account-referral').value;
  if (referralCode && referralCode !== 'Không có') {
    navigator.clipboard.writeText(referralCode).then(() => {
      alert('Đã sao chép mã giới thiệu!');
    }).catch(err => {
      alert('Không thể sao chép mã giới thiệu!');
      console.error('Lỗi sao chép:', err);
    });
  } else {
    alert('Không có mã giới thiệu để sao chép!');
  }
}

function changePassword(event) {
  event.preventDefault();
  const newPassword = document.getElementById('new-password').value.trim();
  const confirmNewPassword = document.getElementById('confirm-new-password').value.trim();
  if (!newPassword || !confirmNewPassword) {
    alert('Vui lòng điền đầy đủ thông tin!');
    return;
  }
  if (newPassword !== confirmNewPassword) {
    alert('Mật khẩu xác nhận không khớp!');
    return;
  }

  const username = localStorage.getItem('currentUser');
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[username]) {
    users[username].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('change-password-form').reset();
    alert('Đổi mật khẩu thành công!');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('currentUser')) {
    isLoggedIn = true;
    updateUserInterface();
  }
  if (window.location.pathname.includes('account.html')) {
    loadAccountInfo();
  } else {
    initChart();
    loadInitialCandlestickData();
    updateCandlestickData();
    updateCoin();
    updateCurrentPrice();
    setInterval(() => { if (currentCoin) updateCoin(); }, 24 * 60 * 60 * 1000);

    const menuToggle = document.getElementById('menu-toggle');
    const menuDropdown = document.getElementById('menu-dropdown');
    if (menuToggle && menuDropdown) {
      menuToggle.addEventListener('click', () => {
        menuDropdown.classList.toggle('hidden');
      });
      document.addEventListener('click', (event) => {
        if (!menuToggle.contains(event.target) && !menuDropdown.contains(event.target)) {
          menuDropdown.classList.add('hidden');
        }
      });
    }
  }
});
