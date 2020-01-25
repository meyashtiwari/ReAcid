App = {
    loading: false,
    contracts: {},
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },

    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      // Set the current blockchain account
      App.account = web3.eth.accounts[0]
    },
  
    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const ReAcid = await $.getJSON('ReAcid.json')
      App.contracts.ReAcid = TruffleContract(ReAcid)
      App.contracts.ReAcid.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.reAcid = await App.contracts.ReAcid.deployed()
    },
  
    render: async () => {
      // Prevent double render
      if (App.loading) {
        return
      }
  
      // Update app loading state
      App.setLoading(true)
  
      // Render Account
      $('#account').html(App.account)
  
      // Render Tasks
      await App.renderTasks()
  
      // Update loading state
      App.setLoading(false)
    },

    createRecord: async () => {
        App.setLoading(true)
        const name = $('#name').val()
        const phoneNo = $('#phoneNo').val()
        const typeOfAcid = $('#typeOfAcid').val()
        await App.reAcid.createRecord(name, phoneNo, typeOfAcid)
        window.location.reload()
    },
  
    renderTasks: async () => {
      // Load the total task count from the blockchain
      const recordCount = await App.reAcid.recordCount()
      const $RecordTemplate = $('.RecordTemplate')
  
      // Render out each task with a new task template
      for (var i = 1; i <= recordCount; i++) {
        // Fetch the task data from the blockchain
        const record = await App.reAcid.records(i)
        const recordId = record[0].toNumber()
        const name = record[1]
        const phone = record[2]
        const typeofacid = record[3]
  
        // Create the html for the task
        const $newRecordTemplate = $RecordTemplate.clone()
        $newRecordTemplate.find('.name').html(name)
        $newRecordTemplate.find('.phoneNo').html(phone)
        $newRecordTemplate.find('.typeOfAcid').html(typeofacid)
        // Show the task
        $('#recordList').append($newRecordTemplate)
        $newRecordTemplate.show()
      }
    },
  
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })