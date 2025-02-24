import { View, Text, TextInput, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'

const SearchInput = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
      <View className=" border-black-200 border-2 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary flex-row items-center space-x-4">
        <TextInput 
          className="flex-1 text-white font-pregular text-base "
          value={value}
          placeholder="Search for a video topic"
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
        />

        <Pressable>
          <Image 
            source={icons.search}
            className="w-5 h-5"
            resizeMode='contain'
          />
        </Pressable>
      </View>
  )
}

export default SearchInput