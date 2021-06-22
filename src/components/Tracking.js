import React, { useState, useEffect } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from 'react-html-parser'
import {
  Card,
  CardBody,
  Input,
  HelperText,
  Label,
  Button,
  Textarea,
  Select,
} from '@windmill/react-ui'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import toast, { Toaster, useToaster } from 'react-hot-toast'
import { FulfillingBouncingCircleSpinner } from 'react-epic-spinners'
import {
  clearCreateShipmentStatus,
  clearShipmentByIdStatus,
  createNewShipment,
  fetchShipmentById,
} from '../app/shipmentsSlice'
import { Editor } from '@tinymce/tinymce-react'
import SectionTitle from '../components/Typography/SectionTitle'
import './pages.css'

import { HeartIcon } from '../icons'

function Tracking() {
  return (
    <>
      {/* <div className="track">
        {detail_shipmentById.map((data) => (
          <div
            key={data.id}
            className={
              data.logic === 'active'
                ? 'step active cursor-pointer'
                : 'step cursor-pointer '
            }
          >
            <span onClick={() => choose(data.id, data.status)} className="icon">
              <i>
                <HeartIcon />
              </i>
            </span>
            <span className="text">{data.status}</span>
          </div>
        ))}
      </div>
      <Button
        size="small"
        onClick={() => onSubmit()}
        className="my-4 float-right"
      >
        {status ? `Update to : ${label}` : 'Update'}
      </Button> */}
    </>
  )
}

export default Tracking
