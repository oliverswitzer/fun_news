defmodule FunZoom.NewsCategory do
  defstruct [:title, :link]

  @type t :: %__MODULE__{
               title: binary(),
               link: binary()
             }
end