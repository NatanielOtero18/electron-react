
import styles from "./App.module.css";
import React from 'react';
import { useState, useEffect } from "react";
import LoadingSpinner from "./components/loadingSpinner/loadingSpinner"
import Navbar from "./components/navbar/Navbar";
import MainView from './components/mainView/mainView';

const App = () => {
  

  const [response, setResponse] = useState({})
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("")
  const [fullList, setFullList] = useState({});
  const [searchActive, setSearchActive] = useState(false);
  

  useEffect(() => {
    setPath().then(() => {
      setLoading(false);
    });

  }, [])

  const activeSearchSwtich = (param) => {
    setSearchActive(param);

  }
  const handleDesc = async (id, desc) =>{
    try {
      setLoading(true);
      let response = await window.api.updateDesc(id, desc).then(()=>{
        updateList(id, null, desc)
        setLoading(false);
      });
      console.log(response)
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdate = async (id, precio) => {
    try {
      setLoading(true);
      let response = await window.api.updatePrice(id, precio).then(() => {
        updateList(id, precio, null)
        setLoading(false);

      });
      console.log(response)
    } catch (error) {
      console.log(error);
    }
  }
  const updateList = (id, precio , desc) => {
    let newList ;
    let newFullList ;
    if(desc === null)
    {
      newList = response.map(element =>{
        if (element.id === id) {
          return {...element, precio: precio}
        }
        return element;
      })
      newFullList = fullList.map(element =>{
        if (element.id === id) {
          return {...element, precio: precio}
        }
        return element;
      })
    }else{
      newList = response.map(element =>{
        if (element.id === id) {
          return {...element, desc: desc}
        }
        return element;
      })
      newFullList = fullList.map(element =>{
        if (element.id === id) {
          return {...element, desc: desc}
        }
        return element;
      })
    } 
    setResponse(newList);
    setFullList(newFullList);
  }
  const setPath = async () => {
    let data = await window.api.getAll();
    console.log(data);
    setFullList(data);
    setResponse(data);
  }
  

  const handleChange = (e) => {    
    if(e.target.value === ""){
      activeSearchSwtich(false)
      setResponse(fullList)
    }
    if (!isNaN(e.target.value)) {
      setSearch(e.target.value)
    }
    else {
      const result = fullList.filter(element => {
        if (e.target.value === "")
          return element;
        return element.producto.toLowerCase().includes(e.target.value.toLowerCase())
      })
      setResponse(result);
      setSearch(e.target.value)
      activeSearchSwtich(true)
    }


  }
  const handleFullList = () => {
    setPath();
    activeSearchSwtich(false);
    setSearch("")
  }
  const handleKeyPress = (e) =>{
    if (e.key === 'Enter') {
      handleSearch(e)
  }
  }
  const handleSearch = (e) => {
    if (search === "") {

    } else {
      activeSearchSwtich(true);
      if (!isNaN(search)) {
        searchProdbyCode(search).then(() => {

          setSearch("")
        });
      }
      else {
        setSearch("")
      }
    }
  }

  const searchProdbyCode = async (id) => {
    let data = await window.api.selectId(id);
    console.log(data);
    setResponse(data);
  }

    const handleDelete = async (id) =>{
    await window.api.deteleProd(id).then(()=>{
      deleteFromList(id);
    });
    
  }
  const deleteFromList = (id) => {
    let newList = response.filter(element => {return element.id !== id})
    let newFullList = fullList.filter(element => {return element.id !== id});
    console.log(newList);
    setResponse(newList);
    setFullList(newFullList);
  }

  const calculateDesc = (price, desc) => {
    let finalPrice = price - (price * (desc / 100))
    return finalPrice;
}

  return (
    <div >
      {
        loading ? <LoadingSpinner />
          : <div>
            <Navbar
              setPath={setPath}
              searchProdbyCode={searchProdbyCode}            

            />
            <MainView
              response={response}
              calculateDesc={calculateDesc}
              searchActive={searchActive}
              handleKeyPress={handleKeyPress}
              handleSearch={handleSearch}
              handleUpdate={handleUpdate}
              handleDesc={handleDesc}
              search={search}
              handleFullList={handleFullList}
              handleChange={handleChange}
              handleDelete = {handleDelete}
            />
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
          </div>
      }
    </div>
  );
}

export default App;
