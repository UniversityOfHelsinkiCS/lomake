import React from 'react'
import { Link } from 'react-router-dom'
import { Item, Button, Icon, ItemMeta, ItemGroup, ItemHeader, Header, Container } from 'semantic-ui-react'

export const PageItem = ({ title, content }) => (
  <div data-cy={title} style={{ marginBottom: '30px' }}>
    <Header as="h3">{title.toUpperCase()}</Header>
    <Container textAlign="justified">{content}</Container>
  </div>
)

export const DateItem = ({ timestamp, t }) => {
  const date = new Date(timestamp)

  // Check if the time is 00:00
  if (date.getUTCHours() === 0 && date.getUTCMinutes() === 0) {
    // Subtract one minute
    date.setUTCMinutes(date.getUTCMinutes() - 1)
  }

  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1 // getUTCMonth() returns 0-11
  const day = date.getUTCDate()

  let hours = date.getUTCHours()
  if (hours.toString().length === 1) hours = `0${hours.toString()}`
  let minutes = date.getUTCMinutes()
  if (minutes.toString().length === 1) minutes = `0${minutes.toString()}`

  return (
    <p>
      {t('formCloses')}: {day}/{month}/{year} {t('clock')}: {hours}:{minutes}
    </p>
  )
}

export const FormCard = ({ item, dl, t }) => (
  <ItemGroup data-cy={`deadline-label-${dl.form}`} divided key={dl.form}>
    <Item>
      <div
        style={{
          width: '150px',
          overflow: 'hidden',
          position: 'relative',
          marginRight: '10px',
        }}
      >
        <img
          src={item.thumbnail}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          alt={`Thumbnail for ${item.title}`}
        />
      </div>
      <Item.Content>
        <ItemHeader as="h2">{item.parent}</ItemHeader>
        <ItemMeta>
          <span>{item.content && item.content}</span>
          <span>
            <DateItem timestamp={dl.date} t={t} />
          </span>
        </ItemMeta>
        {item.links.map(link => (
          <Button data-cy={`button-${link}`} key={link} as={Link} to={link}>
            {item.title}
            <Icon name="right chevron" />
          </Button>
        ))}
      </Item.Content>
    </Item>
  </ItemGroup>
)
