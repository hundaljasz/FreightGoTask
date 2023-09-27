

App ={
    contracts: {},
    loading: false,
    load:async () =>{
        await App.loadWeb3();    
        await App.loadAccount();
        await App.loadContract();
        await App.render();
        
    },
    loadWeb3: async () => {

      window.addEventListener('load', async () => {
      // Modern dapp browsers...
      if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
      }
      if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
          // Request account access if needed
          await ethereum.enable();
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */});
      } catch (error) {
          // User denied account access...
      }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */});
      }
      // Non-dapp browsers...
      else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
      });
    },
    
    loadAccount: async () =>{
      try{
        const account = await ethereum.request({ method: 'eth_requestAccounts' });
        App.account = account[0];
      }
      catch(err){
        App.setLoading(true);
        console.log('user connection declined');
      }                                     
    },

    loadContract: async () =>{
      const FG = await $.getJSON('freight.json');
      App.contracts.freight = TruffleContract(FG);
      App.contracts.freight.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
      App.fg = await App.contracts.freight.deployed();
      },
    render: async() => {
      if(App.loading)
      return;
      App.setLoading(true);
      $('#account').html(App.account);
      await App.renderTask();
      App.setLoading(false);
    },
    createOrder : async()=>{
      App.setLoading(true);
      const name = $('#name').val();
      const address = $('#address').val();
      const number = $('#number').val();
      await App.fg.AddOrders(name,address,number, {from: App.account});
      window.location.reload();
    },
    toggleCompleted:async (e) =>{
      alert("hello")
      App.setLoading(true);
      const taskId = e.target.name;
      await App.fg.toggleCompleted(taskId, {from: App.account});
      window.location.reload();
    },
    setLoading: (bool)=>{
      App.loading = bool;
      const loader = $('#loader');
      const content = $('#list');
      if (bool){
        content.hide();
        loader.show();
        
      }
      else{
        loader.hide();
        content.show();
      }


    },
    renderTask: async()=>{
      // load task count
      const deliveryCount = await App.fg.deliveryCount();
      const _taskTemplate = $('#taskTemplate');
      // render 
      const task_ul = $('#taskList');
      for (let i = 1; i <= deliveryCount; i++) {

        const order = await App.fg.orders(i);
        const orderID = order[0].toNumber();
        const name = order[1];
        const address = order[2];
        const number = order[3];
        const orderStatus = order[4];

        const $newTaskTemplate = _taskTemplate.clone();
        $newTaskTemplate.find('.content').html(name);
        $newTaskTemplate.find('.address').html(address);
        $newTaskTemplate.find('.number').html(number);
        if (!orderStatus) {
          $newTaskTemplate.find('.btn')
          .prop('name', orderID)
          .prop('checked', orderStatus)
          .on('click',App.toggleCompleted);
        } else {
          $newTaskTemplate.find('.btn').removeClass('btn-success').text("Order Delivered").addClass('btn-primary')

        }
      

        $newTaskTemplate.find('.card').show();
        if (orderStatus) {
            $('#completedTaskList').append($newTaskTemplate);
        } else {
            $('#taskList').append($newTaskTemplate);
        }

        if (orderStatus) {
          $('#completedTaskList').append($newTaskTemplate);
        } else {
            $('#taskList').append($newTaskTemplate);
        }
        task_ul.show();
    }
    }
}
window.onload = () => {
    App.load();
  };


