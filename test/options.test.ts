import { describe, it, expect } from 'bun:test'
import { parseArgs, parseOptions } from '../src/index'

describe("parse Options tests", () => {

    it ("Can parse csharp options", () => {
        const [baseUrl, options] = parseOptions(
            `
/* Options:
Date: 2025-11-02 18:44:49
Version: 8.91
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

GlobalNamespace: MyApp
//MakePartial: True
//MakeVirtual: True
//MakeInternal: False
//MakeDataContractsExtensible: False
//AddNullableAnnotations: False
AddReturnMarker: True
//AddDescriptionAsComments: True
//AddDataContractAttributes: False
//AddIndexesToDataMembers: False
//AddGeneratedCodeAttributes: False
//AddResponseStatus: False
//AddImplicitVersion:
//InitializeCollections: False
//ExportValueTypes: False
//IncludeTypes:
//ExcludeTypes:
//AddNamespaces:
//AddDefaultXmlNamespace: http://schemas.servicestack.net/types
*/

using System;
            `, "csharp", "dtos.cs")
        expect(baseUrl).toEqual("https://localhost:5001")
        expect(options.GlobalNamespace).toEqual("MyApp")
        expect(options.AddReturnMarker).toEqual("True")
    })

    it ("Can parse dart options", () => {
        const [baseUrl, options] = parseOptions(
            `
/* Options:
Date: 2025-11-02 18:48:07
Version: 8.91
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

//GlobalNamespace:
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion:
//AddDescriptionAsComments: True
//IncludeTypes:
//ExcludeTypes:
DefaultImports: package:servicestack/servicestack.dart
*/

import 'package:servicestack/servicestack.dart';
            `, "dart", "dtos.dart")
        expect(baseUrl).toEqual("https://localhost:5001")
        expect(options.DefaultImports).toEqual("package:servicestack/servicestack.dart")
    })

    it ("Can parse fsharp options", () => {
        const [baseUrl, options] = parseOptions(
            `
(* Options:
Date: 2025-11-02 18:48:07
Version: 8.91
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

//GlobalNamespace:
//MakeDataContractsExtensible: False
//AddReturnMarker: True
//AddDescriptionAsComments: True
//AddDataContractAttributes: False
//AddIndexesToDataMembers: False
//AddGeneratedCodeAttributes: False
//AddResponseStatus: False
//AddImplicitVersion:
//ExportValueTypes: False
//IncludeTypes:
//ExcludeTypes:
//InitializeCollections: False
//AddNamespaces:
*)

namespace MyApp.ServiceModel
            `, "fsharp", "dtos.fs")
        expect(baseUrl).toEqual("https://localhost:5001")
        expect(options).toBeDefined()
    })

    it ("Can parse go options", () => {
        const [baseUrl, options] = parseOptions(
            `
/* Options:
Date: 2025-11-02 18:35:04
Version: 8.91
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

//GlobalNamespace:
//MakePropertiesOptional: False
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion:
//AddDescriptionAsComments: True
//IncludeTypes:
//ExcludeTypes:
DefaultImports: encoding/json,time
*/

package dtos
            `, "go", "dtos.go")
        expect(baseUrl).toEqual("https://localhost:5001")
        expect(options.DefaultImports).toEqual("encoding/json,time")
    })

    it ("Can parse java options", () => {
        const [baseUrl, options] = parseOptions(
            `
/* Options:
Date: 2025-11-02 18:48:08
Version: 8.91
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

//Package:
//GlobalNamespace: dtos
//AddPropertyAccessors: True
//SettersReturnThis: True
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddDescriptionAsComments: True
//AddImplicitVersion:
//IncludeTypes:
//ExcludeTypes:
//TreatTypesAsStrings:
DefaultImports: java.math.*,java.util.*,java.io.InputStream,net.servicestack.client.*,com.google.gson.annotations.*,com.google.gson.reflect.*
*/

import java.math.*;
            `, "java", "dtos.java")
        expect(baseUrl).toEqual("https://localhost:5001")
        expect(options.DefaultImports).toEqual("java.math.*,java.util.*,java.io.InputStream,net.servicestack.client.*,com.google.gson.annotations.*,com.google.gson.reflect.*")
    })

    it ("Can parse kotlin options", () => {
        const [baseUrl, options] = parseOptions(
            `
/* Options:
Date: 2025-11-02 18:48:08
Version: 8.91
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

//Package:
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion:
//AddDescriptionAsComments: True
//IncludeTypes:
//ExcludeTypes:
//InitializeCollections: False
//TreatTypesAsStrings:
DefaultImports: java.math.*,java.util.*,java.io.InputStream,net.servicestack.client.*,com.google.gson.annotations.*,com.google.gson.reflect.*
*/

import java.math.*
            `, "kotlin", "dtos.kt")
        expect(baseUrl).toEqual("https://localhost:5001")
        expect(options.DefaultImports).toEqual("java.math.*,java.util.*,java.io.InputStream,net.servicestack.client.*,com.google.gson.annotations.*,com.google.gson.reflect.*")
    })

    it ("Can parse javascript options", () => {
        const [baseUrl, options] = parseOptions(
            `
/* Options:
Date: 2025-11-02 18:48:09
Version: 8.91
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

//AddServiceStackTypes: True
//AddDocAnnotations: True
//AddDescriptionAsComments: True
//IncludeTypes:
//ExcludeTypes:
//DefaultImports:
*/

"use strict";
            `, "javascript", "dtos.mjs")
        expect(baseUrl).toEqual("https://localhost:5001")
        expect(options).toBeDefined()
    })

    it ("Can parse php options", () => {
        const [baseUrl, options] = parseOptions(
            `
<?php namespace dtos;
/* Options:
Date: 2025-11-02 18:48:09
Version: 8.91
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

//GlobalNamespace: dtos
//MakePropertiesOptional: False
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion:
//AddDescriptionAsComments: True
//IncludeTypes:
//ExcludeTypes:
//DefaultImports:
*/


use DateTime;
            `, "php", "dtos.php")
        expect(baseUrl).toEqual("https://localhost:5001")
        expect(options).toBeDefined()
    })

    it ("Can parse python options", () => {
        const [baseUrl, options] = parseOptions(
            `
""" Options:
Date: 2025-11-02 18:48:10
Version: 8.91
Tip: To override a DTO option, remove "#" prefix before updating
BaseUrl: https://localhost:5001

#GlobalNamespace:
#AddServiceStackTypes: True
#AddResponseStatus: False
#AddImplicitVersion:
#AddDescriptionAsComments: True
#IncludeTypes:
#ExcludeTypes:
DefaultImports: datetime,decimal,marshmallow.fields:*,servicestack:*,typing:*,dataclasses:dataclass/field,dataclasses_json:dataclass_json/LetterCase/Undefined/config,enum:Enum/IntEnum
#DataClass:
#DataClassJson:
"""

import datetime
            `, "python", "dtos.py")
        expect(baseUrl).toEqual("https://localhost:5001")
        expect(options.DefaultImports).toEqual("datetime,decimal,marshmallow.fields:*,servicestack:*,typing:*,dataclasses:dataclass/field,dataclasses_json:dataclass_json/LetterCase/Undefined/config,enum:Enum/IntEnum")
    })

    it ("Can parse ruby options", () => {
        const [baseUrl, options] = parseOptions(
            `
# frozen_string_literal: true
# encoding: utf-8

# Options:
=begin
Date: 2025-11-02 18:35:04
Version: 8.91
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

#MakePartial: True
#MakeVirtual: True
#MakeInternal: False
#MakeDataContractsExtensible: False
#AddReturnMarker: True
#AddDescriptionAsComments: True
#AddDataContractAttributes: False
#AddIndexesToDataMembers: False
#AddGeneratedCodeAttributes: False
#AddResponseStatus: False
#AddImplicitVersion:
#InitializeCollections: False
#ExportValueTypes: False
#IncludeTypes:
#ExcludeTypes:
#AddNamespaces:
#AddDefaultXmlNamespace: http://schemas.servicestack.net/types
=end

require 'json'
            `, "ruby", "dtos.rb")
        expect(baseUrl).toEqual("https://localhost:5001")
        expect(options).toBeDefined()
    })

    it ("Can parse rust options", () => {
        const [baseUrl, options] = parseOptions(
            `
/* Options:
Date: 2025-11-02 18:35:05
Version: 8.91
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

//GlobalNamespace:
//MakePropertiesOptional: False
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion:
//AddDescriptionAsComments: True
//IncludeTypes:
//ExcludeTypes:
DefaultImports: serde::{Serialize, Deserialize},std::collections::HashMap
*/

use serde::{Serialize, Deserialize};
            `, "rust", "dtos.rs")
        expect(baseUrl).toEqual("https://localhost:5001")
        expect(options.DefaultImports).toEqual("serde::{Serialize, Deserialize},std::collections::HashMap")
    })

    it ("Can parse swift options", () => {
        const [baseUrl, options] = parseOptions(
            `
/* Options:
Date: 2025-11-02 18:48:11
SwiftVersion: 6.0
Version: 8.91
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

//BaseClass:
//AddModelExtensions: True
//AddServiceStackTypes: True
//MakePropertiesOptional: True
//IncludeTypes:
//ExcludeTypes:
//ExcludeGenericBaseTypes: False
//AddResponseStatus: False
//AddImplicitVersion:
//AddDescriptionAsComments: True
//InitializeCollections: False
//TreatTypesAsStrings:
DefaultImports: Foundation,ServiceStack
*/

import Foundation
            `, "swift", "dtos.swift")
        expect(baseUrl).toEqual("https://localhost:5001")
        expect(options.DefaultImports).toEqual("Foundation,ServiceStack")
    })

    it ("Can parse typescript options", () => {
        const [baseUrl, options] = parseOptions(
            `
/* Options:
Date: 2025-11-02 18:48:11
Version: 8.91
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

//GlobalNamespace:
//MakePropertiesOptional: False
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion:
//AddDescriptionAsComments: True
//IncludeTypes:
//ExcludeTypes:
//DefaultImports:
*/


export interface IReturn<T>
            `, "typescript", "dtos.ts")
        expect(baseUrl).toEqual("https://localhost:5001")
        expect(options).toBeDefined()
    })

    it ("Can parse vbnet options", () => {
        const [baseUrl, options] = parseOptions(
            `
' Options:
'Date: 2025-11-02 18:48:11
'Version: 8.91
'Tip: To override a DTO option, remove "''" prefix before updating
'BaseUrl: https://localhost:5001
'
'''GlobalNamespace:
'''MakePartial: True
'''MakeVirtual: True
'''MakeDataContractsExtensible: False
'''AddReturnMarker: True
'''AddDescriptionAsComments: True
'''AddDataContractAttributes: False
'''AddIndexesToDataMembers: False
'''AddGeneratedCodeAttributes: False
'''AddResponseStatus: False
'''AddImplicitVersion:
'''InitializeCollections: False
'''ExportValueTypes: False
'''IncludeTypes:
'''ExcludeTypes:
'''AddNamespaces:
'''AddDefaultXmlNamespace: http://schemas.servicestack.net/types

Imports System
            `, "vbnet", "dtos.vb")
        expect(baseUrl).toEqual("https://localhost:5001")
        expect(options).toBeDefined()
    })

    it ("Can parse zig options", () => {
        const [baseUrl, options] = parseOptions(
            `
/// Options:
/// Date: 2025-11-02 18:33:41
/// Version: 8.91
/// Tip: To override a DTO option, remove "//" prefix before updating
/// BaseUrl: https://localhost:5001

//GlobalNamespace:
//MakePropertiesOptional: False
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion:
//AddDescriptionAsComments: True
//IncludeTypes:
//ExcludeTypes:
DefaultImports: const std = @import("std");
///

const std = @import("std");
            `, "zig", "dtos.zig")
        expect(baseUrl).toEqual("https://localhost:5001")
        expect(options.DefaultImports).toEqual('const std = @import("std");')
    })

})