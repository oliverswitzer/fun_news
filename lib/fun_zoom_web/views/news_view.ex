defmodule FunZoomWeb.NewsView do
  use FunZoomWeb, :view

  def render(anything, %{articles: articles}) do
    %{data: articles |> Enum.map(&article_json/1)}
  end

  defp article_json(article) do
    %{
      image: article.image,
      link: article.link,
      title: article.title,
      bias: article.bias
    }
  end
end
