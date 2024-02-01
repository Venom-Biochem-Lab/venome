FROM python:3.11

WORKDIR /app

COPY . /app/

RUN pip install poetry

RUN poetry config virtualenvs.in-project true

RUN poetry install

RUN wget https://mmseqs.com/foldseek/foldseek-linux-sse2.tar.gz && tar xvzf foldseek-linux-sse2.tar.gz
RUN rm -f foldseek-linux-sse2.tar.gz

EXPOSE 8000