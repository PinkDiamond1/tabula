import React from "react"
import { Chip, Grid, Typography } from "@mui/material"
import { styled } from "@mui/styles"
import { palette, typography } from "../../theme"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { Article } from "../../models/publication"
import EditIcon from "@mui/icons-material/Edit"
import { shortTitle } from "../../utils/string"
import moment from "moment"

const PostItemContainer = styled(Grid)({
  minHeight: "105px",
  background: palette.grays[100],
  borderRadius: 4,
  padding: "10px 20px",
  cursor: "pointer",
  "&:hover": {
    background: palette.grays[200],
  }
})
const PostItemIconGrid = styled(Grid)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#91908e",
})

const PostItemEditContainer = styled(Grid)({
  border: `2px solid ${palette.grays[600]}`,
  background: palette.whites[600],
  borderRadius: 4,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 32,
  height: 32,
  cursor: "pointer",
})

type PostItemProps = {
  article: Article
  onClick: (articleId: string) => void
}
const PostItem: React.FC<PostItemProps> = ({ article, onClick }) => {
  const { title, tags, lastUpdated, id } = article
  const articleTitle = shortTitle(title, 30)
  const date = lastUpdated && new Date(parseInt(lastUpdated) * 1000)

  return (
    <PostItemContainer container alignItems={"center"} onClick={() => onClick(id ? id : "")}>
      <Grid item xs={10}>
        <Grid container flexDirection={"column"} gap={1}>
          <Grid item>
            <Typography fontFamily={typography.fontFamilies.sans} variant="subtitle1" fontWeight={600}>
              {articleTitle}
            </Typography>
          </Grid>

          <Grid item>
            <Grid container gap={1}>
              {date && <Typography>{moment(date).format("MMMM DD, YYYY")}</Typography>}
              {tags && tags.length > 0 && tags.map((tag, index) => <Chip label={tag} size="small" key={index} />)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <PostItemIconGrid item xs={2}>
        <Grid container alignItems={"center"} justifyContent={"space-between"}>
          <PostItemEditContainer>
            <EditIcon style={{ color: palette.grays[1000] }} />
          </PostItemEditContainer>
          <ArrowForwardIosIcon />
        </Grid>
      </PostItemIconGrid>
    </PostItemContainer>
  )
}

export default PostItem