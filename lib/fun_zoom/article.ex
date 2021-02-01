defmodule FunZoom.Article do
  defstruct [:title, :image, :bias, :link]

  @type t :: %__MODULE__{
               title: binary(),
               image: binary(),
               bias: binary(),
               link: binary()
             }
end
