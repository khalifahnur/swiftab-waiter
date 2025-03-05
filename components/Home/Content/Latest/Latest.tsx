import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScrollLists from '../ScrollLists'
import { FetchOrder } from '@/types';

interface dataTypes{
    data?: FetchOrder[];
    refreshing: boolean;
    onRefresh: () => void;
}
export default function Latest({data,refreshing, onRefresh}:dataTypes) {
  return (
    <ScrollLists placeholderData={data} refreshing={refreshing} onRefresh={onRefresh}/>
  )
}

const styles = StyleSheet.create({})