import styled from 'styled-components'
import { Button } from '@material-ui/core'

const Mickey = styled(Button)`
  display: flex;
  margin: 20vw auto 32px;
  width: 30vw;
  height: 30vw;
  border-radius: 50%;
  position: relative;
  background-color: rgba(245,226,196,1);
  color: white;
  font-size: 1.5rem;
  transition: 0.5s;
  max-width: 240px;
  max-height: 240px;
  &::before {
    transition: 0.5s;
    width: 20vw;
    height: 20vw;
    border-radius: 50%;
    position: absolute;
    right: -33%;
    top: -50%;
    content: '';
    background-color: rgba(245,226,196,1);
    max-width: 160px;
    max-height: 160px;
  }
  &::after {
    transition: 0.5s;
    width: 20vw;
    height: 20vw;
    border-radius: 50%;
    position: absolute;
    left: -33%;
    top: -50%;
    content: '';
    background-color: rgba(245,226,196,1);
    max-width: 160px;
    max-height: 160px;
  }
  &:hover {
    transition: 0.5s;
    background-color: rgba(209,223,210,1);
    color: white;
    &::after {
      transition: 0.5s;
      background-color: rgba(209,223,210,1);
    }
    &::before {
      transition: 0.5s;
      background-color: rgba(209,223,210,1);
    }
  }
`